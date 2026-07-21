import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/models';

interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearAll: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const exists = get().items.some(p => p.id === product.id);
        if (!exists) {
          set(state => ({ items: [...state.items, product] }));
        }
      },
      removeItem: (productId) => {
        set(state => ({ items: state.items.filter(p => p.id !== productId) }));
      },
      isInWishlist: (productId) => {
        return get().items.some(p => p.id === productId);
      },
      clearAll: () => set({ items: [] }),
    }),
    { name: 'taphoa-wishlist' }
  )
);
