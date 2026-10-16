import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { config, uploadsDir } from './config.ts';

fs.mkdirSync(uploadsDir, { recursive: true });

export const db = new DatabaseSync(path.join(config.dataDir, 'store.db'));

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role          TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at    TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS products (
    id             INTEGER PRIMARY KEY,
    slug           TEXT NOT NULL UNIQUE,
    name           TEXT NOT NULL,
    brand          TEXT NOT NULL,
    category       TEXT NOT NULL,
    gender         TEXT NOT NULL,
    price          INTEGER NOT NULL,
    original_price INTEGER,
    rating         REAL NOT NULL DEFAULT 0,
    review_count   INTEGER NOT NULL DEFAULT 0,
    stock          INTEGER NOT NULL CHECK (stock >= 0),
    sizes          TEXT NOT NULL,  -- JSON array
    colors         TEXT NOT NULL,  -- JSON array
    images         TEXT NOT NULL,  -- JSON array
    description    TEXT NOT NULL,
    details        TEXT NOT NULL,  -- JSON array
    is_new         INTEGER NOT NULL DEFAULT 0,
    is_bestseller  INTEGER NOT NULL DEFAULT 0,
    position       INTEGER NOT NULL DEFAULT 0,
    created_at     TEXT NOT NULL
  );

  -- Orders keep a JSON snapshot of items, address and totals as they were at purchase time.
  CREATE TABLE IF NOT EXISTS orders (
    id             TEXT PRIMARY KEY,
    user_id        INTEGER REFERENCES users(id) ON DELETE SET NULL,
    user_email     TEXT NOT NULL,
    status         TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'delivered')),
    items          TEXT NOT NULL,
    shipping       TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    payment_label  TEXT NOT NULL,
    totals         TEXT NOT NULL,
    created_at     TEXT NOT NULL,
    delivered_at   TEXT
  );

  CREATE INDEX IF NOT EXISTS orders_user_idx ON orders (user_id, created_at);
`);

/** Runs fn inside a transaction, rolling back if it throws. */
export function transaction<T>(fn: () => T): T {
  db.exec('BEGIN');
  try {
    const result = fn();
    db.exec('COMMIT');
    return result;
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

export const now = () => new Date().toISOString();
