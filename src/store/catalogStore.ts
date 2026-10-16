import { create } from 'zustand';
import { api, errorMessage } from '../lib/api';
import type { Product } from '../types';

interface CatalogState {
  products: Product[];
  status: 'idle' | 'loading' | 'ready' | 'error';
  error: string | null;
  load: () => Promise<void>;
  upsert: (product: Product) => void;
  remove: (id: number) => void;
}

let inFlight: Promise<void> | null = null;

/** The product catalog, fetched from the API and shared by the storefront and the admin panel. */
export const useCatalogStore = create<CatalogState>()((set) => ({
  products: [],
  status: 'idle',
  error: null,

  load: () => {
    inFlight ??= (async () => {
      set((state) => ({ status: state.status === 'ready' ? 'ready' : 'loading', error: null }));
      try {
        const { products } = await api<{ products: Product[] }>('/products');
        set({ products, status: 'ready' });
      } catch (error) {
        set((state) => ({ status: state.status === 'ready' ? 'ready' : 'error', error: errorMessage(error) }));
      } finally {
        inFlight = null;
      }
    })();
    return inFlight;
  },

  upsert: (product) =>
    set((state) => ({
      products: state.products.some((p) => p.id === product.id)
        ? state.products.map((p) => (p.id === product.id ? product : p))
        : [product, ...state.products],
    })),

  remove: (id) => set((state) => ({ products: state.products.filter((p) => p.id !== id) })),
}));

export const useProducts = () => useCatalogStore((s) => s.products);
export const useCatalogStatus = () => useCatalogStore((s) => s.status);
