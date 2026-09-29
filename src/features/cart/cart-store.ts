import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Product } from '@/features/catalog/api';

import { addProduct, type Cart, removeProduct, setQuantity } from './cart-logic';

type CartState = {
  lines: Cart;
  add: (product: Product, quantity?: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
};

/**
 * Client state only. Server data (products) lives in TanStack Query;
 * the cart is local, so it gets a small persisted store instead.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: {},
      add: (product, quantity) => set((s) => ({ lines: addProduct(s.lines, product, quantity) })),
      setQuantity: (id, quantity) => set((s) => ({ lines: setQuantity(s.lines, id, quantity) })),
      remove: (id) => set((s) => ({ lines: removeProduct(s.lines, id) })),
      clear: () => set({ lines: {} }),
    }),
    {
      name: 'cart',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ lines }) => ({ lines }),
    },
  ),
);
