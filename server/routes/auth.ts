import { Router } from 'express';
import { loginSchema, registerSchema } from '../../shared/schemas.ts';
import {
  assertLoginAllowed,
  authenticate,
  clearLoginFailures,
  currentUser,
  endSession,
  recordLoginFailure,
  registerUser,
  startSession,
} from '../auth.ts';
import { HttpError, parse } from '../http.ts';

export const authRouter = Router();

authRouter.get('/me', (_req, res) => {
  res.json({ user: currentUser(res) });
});

authRouter.post('/register', async (req, res) => {
  const user = await registerUser(parse(registerSchema, req.body));
  startSession(req, res, user.id);
  res.status(201).json({ user });
});

authRouter.post('/login', async (req, res) => {
  const { email, password, asAdmin } = parse(loginSchema, req.body);
  const limitKey = `${req.ip}|${email}`;
  assertLoginAllowed(limitKey);

  const user = await authenticate(email, password);
  if (!user) {
    recordLoginFailure(limitKey);
    throw new HttpError(401, 'Incorrect email or password.');
  }
  if (asAdmin && user.role !== 'admin') {
    throw new HttpError(403, 'This account does not have admin access.');
  }
  clearLoginFailures(limitKey);
  startSession(req, res, user.id);
  res.json({ user });
});

authRouter.post('/logout', (req, res) => {
  endSession(req, res);
  res.status(204).end();
});
