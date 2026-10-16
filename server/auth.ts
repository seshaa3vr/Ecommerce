import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import type { Request, RequestHandler, Response } from 'express';
import type { Role, User } from '../shared/types.ts';
import { config } from './config.ts';
import { db, now } from './db.ts';
import { HttpError } from './http.ts';

const scryptAsync = promisify(scrypt) as (password: string, salt: Buffer, keylen: number) => Promise<Buffer>;

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, 64);
  return `scrypt:${salt.toString('hex')}:${hash.toString('hex')}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [scheme, saltHex, hashHex] = stored.split(':');
  if (scheme !== 'scrypt' || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, 'hex');
  const actual = await scryptAsync(password, Buffer.from(saltHex, 'hex'), expected.length);
  return timingSafeEqual(actual, expected);
}

// Compared against when an email is unknown, so response time doesn't reveal which emails have accounts.
const DUMMY_HASH = await hashPassword(randomBytes(16).toString('hex'));

type UserRow = { id: number; name: string; email: string; role: Role; password_hash: string };

const toUser = ({ id, name, email, role }: UserRow): User => ({ id, name, email, role });

export async function registerUser(input: { name: string; email: string; password: string }): Promise<User> {
  if (db.prepare('SELECT 1 FROM users WHERE email = ?').get(input.email)) {
    throw new HttpError(409, 'An account with this email already exists. Try signing in.', {
      email: 'An account with this email already exists. Try signing in.',
    });
  }
  const passwordHash = await hashPassword(input.password);
  const result = db
    .prepare('INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)')
    .run(input.name, input.email, passwordHash, 'customer', now());
  return { id: Number(result.lastInsertRowid), name: input.name, email: input.email, role: 'customer' };
}

export async function authenticate(email: string, password: string): Promise<User | null> {
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as UserRow | undefined;
  const valid = await verifyPassword(password, row?.password_hash ?? DUMMY_HASH);
  return row && valid ? toUser(row) : null;
}

/** Creates or updates the admin account from ADMIN_EMAIL / ADMIN_PASSWORD, so changing .env and restarting resets it. */
export async function ensureAdmin() {
  const { adminEmail, adminPassword, adminName } = config;
  if (!adminEmail || !adminPassword) {
    console.warn('⚠ No admin account configured. Set ADMIN_EMAIL and ADMIN_PASSWORD in .env to enable /admin.');
    return;
  }
  if (adminPassword.length < 10) console.warn('⚠ ADMIN_PASSWORD is short. Use at least 10 characters.');

  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(adminEmail) as UserRow | undefined;
  if (!row) {
    db.prepare('INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)').run(
      adminName,
      adminEmail,
      await hashPassword(adminPassword),
      'admin',
      now(),
    );
    console.log(`✓ Created admin account ${adminEmail}`);
    return;
  }
  if (row.role !== 'admin' || !(await verifyPassword(adminPassword, row.password_hash))) {
    db.prepare('UPDATE users SET role = ?, password_hash = ? WHERE id = ?').run('admin', await hashPassword(adminPassword), row.id);
    db.prepare('DELETE FROM sessions WHERE user_id = ?').run(row.id);
    console.log(`✓ Updated admin account ${adminEmail}`);
  }
}

// ---- Sessions: a random token in an httpOnly cookie; only its hash is stored. ----

const SESSION_COOKIE = 'tl_session';
const SESSION_DAYS = 30;
const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

function readCookie(req: Request, name: string) {
  for (const part of (req.headers.cookie ?? '').split(';')) {
    const [key, ...value] = part.trim().split('=');
    if (key === name) return decodeURIComponent(value.join('='));
  }
  return undefined;
}

export function startSession(req: Request, res: Response, userId: number) {
  endSession(req, res);
  const token = randomBytes(32).toString('base64url');
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)').run(hashToken(token), userId, expires.toISOString());
  res.cookie(SESSION_COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: req.secure, expires, path: '/' });
}

export function endSession(req: Request, res: Response) {
  const token = readCookie(req, SESSION_COOKIE);
  if (token) db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(hashToken(token));
  res.clearCookie(SESSION_COOKIE, { path: '/' });
}

export function purgeExpiredSessions() {
  db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(now());
}

/** Attaches the signed-in user (or null) to res.locals.user. */
export const loadUser: RequestHandler = (req, res, next) => {
  const token = readCookie(req, SESSION_COOKIE);
  const row = token
    ? (db
        .prepare('SELECT users.* FROM sessions JOIN users ON users.id = sessions.user_id WHERE token_hash = ? AND expires_at > ?')
        .get(hashToken(token), now()) as UserRow | undefined)
    : undefined;
  res.locals.user = row ? toUser(row) : null;
  next();
};

export function currentUser(res: Response): User | null {
  return (res.locals.user as User | null | undefined) ?? null;
}

export function requireUser(res: Response): User {
  const user = currentUser(res);
  if (!user) throw new HttpError(401, 'Please sign in to continue.');
  return user;
}

export const requireAdmin: RequestHandler = (_req, res, next) => {
  if (requireUser(res).role !== 'admin') throw new HttpError(403, 'Admin access required.');
  next();
};

// ---- Brute-force protection: 10 failed sign-ins per IP and email, then a 15-minute pause. ----

const MAX_FAILURES = 10;
const WINDOW_MS = 15 * 60 * 1000;
const failures = new Map<string, { count: number; resetAt: number }>();

export function assertLoginAllowed(key: string) {
  const entry = failures.get(key);
  if (entry && entry.resetAt > Date.now() && entry.count >= MAX_FAILURES) {
    throw new HttpError(429, 'Too many sign-in attempts. Please wait 15 minutes and try again.');
  }
}

export function recordLoginFailure(key: string) {
  if (failures.size > 10_000) {
    for (const [k, v] of failures) if (v.resetAt <= Date.now()) failures.delete(k);
  }
  const entry = failures.get(key);
  if (!entry || entry.resetAt <= Date.now()) failures.set(key, { count: 1, resetAt: Date.now() + WINDOW_MS });
  else entry.count += 1;
}

export function clearLoginFailures(key: string) {
  failures.delete(key);
}
