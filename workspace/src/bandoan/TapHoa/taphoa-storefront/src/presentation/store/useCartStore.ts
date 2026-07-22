import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/domain/entities/Product';
import { CartItem } from '@/domain/entities/Cart';

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  couponCode: string;
  discountAmount: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getShippingFee: () => number;
  getFinalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      couponCode: '',
      discountAmount: 0,

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      addItem: (product: Product, quantity = 1) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex(i => i.product.id === product.id);

        if (existingIndex > -1) {
          const updated = [...currentItems];
          updated[existingIndex].quantity += quantity;
          set({ items: updated, isCartOpen: true });
        } else {
          set({ items: [...currentItems, { product, quantity }], isCartOpen: true });
        }
      },

      removeItem: (productId: string) => {
        set({ items: get().items.filter(i => i.product.id !== productId) });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map(i => i.product.id === productId ? { ...i, quantity } : i)
        });
      },

      applyCoupon: (code: string) => {
        const cleanCode = code.trim().toUpperCase();
        if (cleanCode === 'TAPHOA10' || cleanCode === 'FREESHIP') {
          const discount = cleanCode === 'TAPHOA10' ? 10000 : 15000;
          set({ couponCode: cleanCode, discountAmount: discount });
          return true;
        }
        return false;
      },

      removeCoupon: () => set({ couponCode: '', discountAmount: 0 }),

      clearCart: () => set({ items: [], couponCode: '', discountAmount: 0 }),

      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      getTotalPrice: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),

      getShippingFee: () => {
        const total = get().getTotalPrice();
        if (total === 0) return 0;
        return total >= 150000 ? 0 : 15000; // Free shipping for orders >= 150k
      },

      getFinalPrice: () => {
        const total = get().getTotalPrice();
        const ship = get().getShippingFee();
        const discount = get().discountAmount;
        return Math.max(0, total + ship - discount);
      }
    }),
    {
      name: 'taphoa-cart-storage',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {}
      }))
    }
  )
);
