import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');

// Settings come from environment variables, loaded from .env by the npm scripts.
export const config = {
  port: Number(process.env.PORT ?? 3001),
  dataDir: path.resolve(root, process.env.DATA_DIR ?? 'data'),
  distDir: path.join(root, 'dist'),
  adminEmail: process.env.ADMIN_EMAIL?.trim().toLowerCase() || undefined,
  adminPassword: process.env.ADMIN_PASSWORD || undefined,
  adminName: process.env.ADMIN_NAME?.trim() || 'Store Admin',
  /** Which proxies to trust for client IP and HTTPS detection (Express "trust proxy" setting). */
  trustProxy: process.env.TRUST_PROXY ?? 'loopback, linklocal, uniquelocal',
};

export const uploadsDir = path.join(config.dataDir, 'uploads');
