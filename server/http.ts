import type { ErrorRequestHandler, RequestHandler } from 'express';
import multer from 'multer';
import type { z } from 'zod';

export class HttpError extends Error {
  status: number;
  fields?: Record<string, string>;

  constructor(status: number, message: string, fields?: Record<string, string>) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

/** Validates input against a schema, turning failures into a 400 with per-field messages. */
export function parse<T extends z.ZodType>(schema: T, data: unknown): z.output<T> {
  const result = schema.safeParse(data);
  if (result.success) return result.data;
  const fields: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path.join('.');
    if (key && !fields[key]) fields[key] = issue.message;
  }
  throw new HttpError(400, result.error.issues[0]?.message ?? 'Invalid request', fields);
}

export function parseId(value: unknown) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(404, 'Not found');
  return id;
}

const uploadErrors: Partial<Record<multer.ErrorCode, string>> = {
  LIMIT_FILE_SIZE: 'Each photo must be 5 MB or smaller.',
  LIMIT_FILE_COUNT: 'Upload up to 8 photos at a time.',
  LIMIT_UNEXPECTED_FILE: 'Unexpected upload field.',
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof HttpError) {
    res.status(error.status).json({ error: error.message, fields: error.fields });
    return;
  }
  if (error instanceof multer.MulterError) {
    res.status(400).json({ error: uploadErrors[error.code] ?? error.message });
    return;
  }
  // Client errors raised by Express itself, e.g. malformed JSON or a missing static file.
  if (typeof error?.status === 'number' && error.status >= 400 && error.status < 500) {
    const fallback = error.status === 404 ? 'Not found' : 'Invalid request';
    res.status(error.status).json({ error: error.expose ? error.message : fallback });
    return;
  }
  console.error(error);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
};

export const securityHeaders: RequestHandler = (_req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  });
  next();
};

/** Rejects state-changing API calls sent from other websites. */
export const sameOriginOnly: RequestHandler = (req, _res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const origin = req.get('origin');
  if (origin && URL.canParse(origin) && new URL(origin).host !== req.get('host')) {
    throw new HttpError(403, 'Cross-site request blocked');
  }
  next();
};
