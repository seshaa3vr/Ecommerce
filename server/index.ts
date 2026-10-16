import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import { ensureAdmin, loadUser, purgeExpiredSessions } from './auth.ts';
import { config, uploadsDir } from './config.ts';
import { errorHandler, sameOriginOnly, securityHeaders } from './http.ts';
import { seedProductsIfEmpty } from './products.ts';
import { adminRouter } from './routes/admin.ts';
import { authRouter } from './routes/auth.ts';
import { storeRouter } from './routes/store.ts';

seedProductsIfEmpty();
await ensureAdmin();
purgeExpiredSessions();
setInterval(purgeExpiredSessions, 60 * 60 * 1000).unref();

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', config.trustProxy);
app.use(securityHeaders);

// ---- API ----
app.use('/api', express.json({ limit: '200kb' }), sameOriginOnly, loadUser);
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api', storeRouter);
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ---- Uploaded product photos ----
app.use('/uploads', express.static(uploadsDir, { maxAge: '30d', immutable: true, fallthrough: false }));

// ---- Built storefront (after `npm run build`); in development Vite serves it instead ----
const indexHtml = path.join(config.distDir, 'index.html');
if (fs.existsSync(indexHtml)) {
  app.use(
    express.static(config.distDir, {
      index: false,
      setHeaders: (res, filePath) => {
        // Vite fingerprints files in /assets, so they can be cached forever.
        if (filePath.includes(`${path.sep}assets${path.sep}`)) res.set('Cache-Control', 'public, max-age=31536000, immutable');
      },
    }),
  );
  // Single-page app: every other GET returns index.html and React Router takes over.
  app.use((req, res, next) => {
    if (req.method !== 'GET') return next();
    res.set('Cache-Control', 'no-cache').sendFile(indexHtml);
  });
}

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`✓ API server running at http://localhost:${config.port}`);
});
