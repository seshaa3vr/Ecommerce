import type { Category, CartItem, CartTotals } from './types.ts';

// Business rules that the storefront displays and the server enforces.
export const LOCALE = 'en-IN';
export const CURRENCY = 'INR';

export const FREE_SHIPPING_THRESHOLD = 1999;
export const SHIPPING_FEE = 99;
export const TAX_RATE = 0.05;
export const TAX_LABEL = 'GST (5%)';
export const DELIVERY_DAYS = 5;
export const MAX_QTY_PER_ITEM = 10;

export const categories: Category[] = [
  { id: 'shirts', name: 'Shirts & Tees' },
  { id: 'dresses', name: 'Dresses' },
  { id: 'gowns', name: 'Evening Gowns' },
  { id: 'sneakers', name: 'Sneakers' },
  { id: 'heels', name: 'Heels & Pumps' },
  { id: 'bags', name: 'Bags' },
  { id: 'sunglasses', name: 'Sunglasses' },
];

export function cartItemKey(productId: number, size: string | undefined, color: string) {
  return [productId, size ?? 'one-size', color].join('|');
}

export function calculateTotals(items: Pick<CartItem, 'price' | 'originalPrice' | 'quantity'>[]): CartTotals {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const savings = items.reduce(
    (sum, item) => sum + Math.max(0, (item.originalPrice ?? item.price) - item.price) * item.quantity,
    0,
  );
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const tax = Math.round(subtotal * TAX_RATE);
  return { itemCount, subtotal, savings, shipping, tax, total: subtotal + shipping + tax };
}
