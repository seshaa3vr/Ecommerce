import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MAX_QTY_PER_ITEM } from '../config';
import type { CartItem, Product } from '../types';
import { cartItemKey } from '../utils/cart';

export type NewCartItem = Omit<CartItem, 'key' | 'quantity'>;

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: NewCartItem, quantity?: number) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  /** Refreshes names, prices and stock limits from the live catalog, dropping items that were removed or sold out. */
  syncWithCatalog: (products: Product[]) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,

      addItem: (item, quantity = 1) =>
        set((state) => {
          const key = cartItemKey(item.productId, item.size, item.color);
          const existing = state.items.find((i) => i.key === key);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.key === key ? { ...i, quantity: Math.min(i.quantity + quantity, i.maxQuantity) } : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, key, quantity: Math.min(quantity, item.maxQuantity) }] };
        }),

      updateQuantity: (key, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.key === key ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxQuantity)) } : i,
          ),
        })),

      removeItem: (key) => set((state) => ({ items: state.items.filter((i) => i.key !== key) })),
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      syncWithCatalog: (products) =>
        set((state) => {
          const byId = new Map(products.map((p) => [p.id, p]));
          const items = state.items.flatMap((item) => {
            const product = byId.get(item.productId);
            if (!product || product.stock === 0) return [];
            const maxQuantity = Math.min(product.stock, MAX_QTY_PER_ITEM);
            return [
              {
                ...item,
                name: product.name,
                slug: product.slug,
                brand: product.brand,
                image: product.images[0],
                price: product.price,
                originalPrice: product.originalPrice,
                maxQuantity,
                quantity: Math.min(item.quantity, maxQuantity),
              },
            ];
          });
          return { items };
        }),
    }),
    { name: 'threadline-cart', partialize: (state) => ({ items: state.items }) },
  ),
);

export const useCartCount = () => useCartStore((state) => state.items.reduce((sum, i) => sum + i.quantity, 0));
