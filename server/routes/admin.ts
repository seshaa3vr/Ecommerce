import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import multer from 'multer';
import { orderStatusSchema, productInputSchema, productPatchSchema } from '../../shared/schemas.ts';
import { requireAdmin } from '../auth.ts';
import { uploadsDir } from '../config.ts';
import { HttpError, parse, parseId } from '../http.ts';
import { deleteOrder, getAdminStats, listOrders, setOrderStatus } from '../orders.ts';
import { createProduct, deleteProduct, patchProduct, updateProduct } from '../products.ts';

export const adminRouter = Router();
adminRouter.use(requireAdmin);

adminRouter.get('/stats', (_req, res) => {
  res.json({ stats: getAdminStats() });
});

// ---- Products ----

adminRouter.post('/products', (req, res) => {
  res.status(201).json({ product: createProduct(parse(productInputSchema, req.body)) });
});

adminRouter.put('/products/:id', (req, res) => {
  res.json({ product: updateProduct(parseId(req.params.id), parse(productInputSchema, req.body)) });
});

adminRouter.patch('/products/:id', (req, res) => {
  res.json({ product: patchProduct(parseId(req.params.id), parse(productPatchSchema, req.body)) });
});

adminRouter.delete('/products/:id', (req, res) => {
  deleteProduct(parseId(req.params.id));
  res.status(204).end();
});

// Photos are saved under random names with an extension chosen from the verified type, never the client's filename.
const imageTypes: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/avif': '.avif',
};

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (_req, file, done) => done(null, `${randomUUID()}${imageTypes[file.mimetype]}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024, files: 8 },
  fileFilter: (_req, file, done) => {
    if (imageTypes[file.mimetype]) done(null, true);
    else done(new HttpError(400, 'Photos must be JPG, PNG, WebP or AVIF images.'));
  },
});

adminRouter.post('/uploads', upload.array('images', 8), (req, res) => {
  const files = (req.files ?? []) as Express.Multer.File[];
  if (files.length === 0) throw new HttpError(400, 'Choose at least one photo to upload.');
  res.status(201).json({ urls: files.map((file) => `/uploads/${file.filename}`) });
});

// ---- Orders ----

adminRouter.get('/orders', (_req, res) => {
  res.json({ orders: listOrders() });
});

adminRouter.patch('/orders/:id', (req, res) => {
  res.json({ order: setOrderStatus(req.params.id, parse(orderStatusSchema, req.body).status) });
});

adminRouter.delete('/orders/:id', (req, res) => {
  deleteOrder(req.params.id);
  res.status(204).end();
});
