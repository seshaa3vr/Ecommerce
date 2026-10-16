import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  ids: number[];
  toggle: (id: number) => void;
  add: (id: number) => void;
  remove: (id: number) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) =>
        set((state) => ({ ids: state.ids.includes(id) ? state.ids.filter((i) => i !== id) : [...state.ids, id] })),
      add: (id) => set((state) => (state.ids.includes(id) ? state : { ids: [...state.ids, id] })),
      remove: (id) => set((state) => ({ ids: state.ids.filter((i) => i !== id) })),
    }),
    { name: 'threadline-wishlist' },
  ),
);
