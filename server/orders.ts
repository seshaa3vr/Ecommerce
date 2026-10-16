import { randomInt } from 'node:crypto';
import type { PlaceOrderInput } from '../shared/schemas.ts';
import { calculateTotals, cartItemKey, MAX_QTY_PER_ITEM } from '../shared/store-rules.ts';
import type { AdminStats, CartItem, Order, OrderStatus, PaymentMethod, User } from '../shared/types.ts';
import { db, now, transaction } from './db.ts';
import { HttpError } from './http.ts';
import { getProduct } from './products.ts';

type OrderRow = {
  id: string;
  user_id: number | null;
  user_email: string;
  status: OrderStatus;
  items: string;
  shipping: string;
  payment_method: PaymentMethod;
  payment_label: string;
  totals: string;
  created_at: string;
  delivered_at: string | null;
};

function toOrder(row: OrderRow): Order {
  return {
    id: row.id,
    createdAt: row.created_at,
    status: row.status,
    deliveredAt: row.delivered_at,
    userId: row.user_id,
    userEmail: row.user_email,
    items: JSON.parse(row.items),
    shipping: JSON.parse(row.shipping),
    paymentMethod: row.payment_method,
    paymentLabel: row.payment_label,
    totals: JSON.parse(row.totals),
  };
}

function newOrderId() {
  for (;;) {
    const id = `TL${Date.now().toString().slice(-6)}${randomInt(1000, 10000)}`;
    if (!db.prepare('SELECT 1 FROM orders WHERE id = ?').get(id)) return id;
  }
}

/** Prices, stock and totals come from the database, never from the browser. Stock is reserved atomically. */
export function placeOrder(user: User, input: PlaceOrderInput): Order {
  return transaction(() => {
    const items: CartItem[] = [];
    const quantities = new Map<number, number>();

    for (const line of input.items) {
      const product = getProduct(line.productId);
      if (!product) {
        throw new HttpError(409, 'An item in your bag is no longer available. Please review your bag and try again.');
      }
      const oneSize = product.sizes.length === 0;
      if (oneSize ? line.size !== undefined : !line.size || !product.sizes.includes(line.size)) {
        throw new HttpError(400, `Please choose an available size for ${product.name}.`);
      }
      if (!product.colors.some((c) => c.name === line.color)) {
        throw new HttpError(400, `Please choose an available colour for ${product.name}.`);
      }
      if (line.quantity > MAX_QTY_PER_ITEM) {
        throw new HttpError(400, `You can order up to ${MAX_QTY_PER_ITEM} of each item.`);
      }
      quantities.set(product.id, (quantities.get(product.id) ?? 0) + line.quantity);
      items.push({
        key: cartItemKey(product.id, line.size, line.color),
        productId: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        image: product.images[0],
        price: product.price,
        ...(product.originalPrice ? { originalPrice: product.originalPrice } : {}),
        ...(line.size ? { size: line.size } : {}),
        color: line.color,
        quantity: line.quantity,
        maxQuantity: Math.min(product.stock, MAX_QTY_PER_ITEM),
      });
    }

    const reserve = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?');
    for (const [productId, quantity] of quantities) {
      if (reserve.run(quantity, productId, quantity).changes === 0) {
        const product = getProduct(productId)!;
        throw new HttpError(
          409,
          product.stock === 0
            ? `Sorry, ${product.name} just sold out. Please remove it from your bag.`
            : `Sorry, only ${product.stock} of ${product.name} left. Please reduce the quantity in your bag.`,
        );
      }
    }

    const { payment } = input;
    const paymentLabel =
      payment.method === 'card' ? `Card ending ${payment.cardLast4}` : payment.method === 'upi' ? `UPI · ${payment.upiId}` : 'Cash on delivery';

    const order: Order = {
      id: newOrderId(),
      createdAt: now(),
      status: 'pending',
      deliveredAt: null,
      userId: user.id,
      userEmail: user.email,
      items,
      shipping: input.shipping,
      paymentMethod: payment.method,
      paymentLabel,
      totals: calculateTotals(items),
    };

    db.prepare(
      `INSERT INTO orders (id, user_id, user_email, status, items, shipping, payment_method, payment_label, totals, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      order.id,
      order.userId,
      order.userEmail,
      order.status,
      JSON.stringify(order.items),
      JSON.stringify(order.shipping),
      order.paymentMethod,
      order.paymentLabel,
      JSON.stringify(order.totals),
      order.createdAt,
    );
    return order;
  });
}

export function listOrders(): Order[] {
  return (db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all() as OrderRow[]).map(toOrder);
}

export function listOrdersForUser(userId: number): Order[] {
  return (db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(userId) as OrderRow[]).map(toOrder);
}

export function getOrder(id: string): Order | undefined {
  const row = db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as OrderRow | undefined;
  return row && toOrder(row);
}

function requireOrder(id: string) {
  const order = getOrder(id);
  if (!order) throw new HttpError(404, 'Order not found');
  return order;
}

export function setOrderStatus(id: string, status: OrderStatus): Order {
  requireOrder(id);
  db.prepare('UPDATE orders SET status = ?, delivered_at = ? WHERE id = ?').run(status, status === 'delivered' ? now() : null, id);
  return requireOrder(id);
}

/** Deleting an order that hasn't been delivered puts its items back in stock. */
export function deleteOrder(id: string) {
  transaction(() => {
    const order = requireOrder(id);
    if (order.status === 'pending') {
      const restock = db.prepare('UPDATE products SET stock = stock + ? WHERE id = ?');
      for (const item of order.items) restock.run(item.quantity, item.productId);
    }
    db.prepare('DELETE FROM orders WHERE id = ?').run(id);
  });
}

export function getAdminStats(): AdminStats {
  const orders = db
    .prepare(
      `SELECT COUNT(*) AS orders,
              COALESCE(SUM(json_extract(totals, '$.total')), 0) AS revenue,
              COALESCE(SUM(status = 'pending'), 0) AS pendingOrders
       FROM orders`,
    )
    .get() as { orders: number; revenue: number; pendingOrders: number };
  const products = db
    .prepare('SELECT COUNT(*) AS products, COALESCE(SUM(stock <= 5), 0) AS lowStockProducts FROM products')
    .get() as { products: number; lowStockProducts: number };
  return { ...orders, ...products };
}
