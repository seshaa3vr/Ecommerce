import { Router } from 'express';
import { placeOrderSchema } from '../../shared/schemas.ts';
import { requireUser } from '../auth.ts';
import { HttpError, parse } from '../http.ts';
import { getOrder, listOrdersForUser, placeOrder } from '../orders.ts';
import { listProducts } from '../products.ts';

/** Public catalog and the signed-in customer's own orders. */
export const storeRouter = Router();

storeRouter.get('/products', (_req, res) => {
  res.set('Cache-Control', 'no-cache').json({ products: listProducts() });
});

storeRouter.post('/orders', (req, res) => {
  const user = requireUser(res);
  const order = placeOrder(user, parse(placeOrderSchema, req.body));
  res.status(201).json({ order });
});

storeRouter.get('/orders', (_req, res) => {
  res.json({ orders: listOrdersForUser(requireUser(res).id) });
});

storeRouter.get('/orders/:id', (req, res) => {
  const user = requireUser(res);
  const order = getOrder(req.params.id);
  // Customers only see their own orders; answering 404 avoids confirming that other order numbers exist.
  if (!order || (order.userId !== user.id && user.role !== 'admin')) throw new HttpError(404, 'Order not found');
  res.json({ order });
});
