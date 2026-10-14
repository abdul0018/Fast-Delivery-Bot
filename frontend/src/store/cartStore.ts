/**
 * Savatcha holati (Zustand + localStorage).
 * Mahsulot nusxasi (snapshot) UI uchun saqlanadi; yakuniy narxni baribir backend hisoblaydi.
 */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { PaymentMethod, Product } from '@/types';

export interface CartItem {
  product: Product;
  quantity: number;
}

const MAX_QUANTITY = 50;

interface CartState {
  items: CartItem[];
  /** Order Bump (masalan, +Kola 5 000 so'm) yoqilganmi */
  bump: boolean;
  paymentMethod: PaymentMethod;

  add: (product: Product, quantity?: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  increment: (productId: number) => void;
  decrement: (productId: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
  setBump: (value: boolean) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  /** Katalog yangilanganda: narx/nomlarni yangilash, o'chirilgan mahsulotlarni olib tashlash */
  syncProducts: (products: Product[]) => void;
}

const clamp = (value: number) => Math.max(0, Math.min(MAX_QUANTITY, Math.floor(value)));

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      bump: false,
      paymentMethod: 'cash',

      add: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id ? { ...item, quantity: clamp(item.quantity + quantity) } : item,
              ),
            };
          }
          return { items: [...state.items, { product, quantity: clamp(quantity) }] };
        }),

      setQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            clamp(quantity) === 0
              ? state.items.filter((item) => item.product.id !== productId)
              : state.items.map((item) =>
                  item.product.id === productId ? { ...item, quantity: clamp(quantity) } : item,
                ),
        })),

      increment: (productId) => {
        const item = get().items.find((entry) => entry.product.id === productId);
        if (item) get().setQuantity(productId, item.quantity + 1);
      },

      decrement: (productId) => {
        const item = get().items.find((entry) => entry.product.id === productId);
        if (item) get().setQuantity(productId, item.quantity - 1);
      },

      remove: (productId) => set((state) => ({ items: state.items.filter((item) => item.product.id !== productId) })),

      clear: () => set({ items: [], bump: false }),

      setBump: (value) => set({ bump: value }),

      setPaymentMethod: (method) => set({ paymentMethod: method }),

      syncProducts: (products) =>
        set((state) => {
          const byId = new Map(products.map((product) => [product.id, product]));
          return {
            items: state.items
              .filter((item) => byId.has(item.product.id))
              .map((item) => ({ ...item, product: byId.get(item.product.id)! })),
          };
        }),
    }),
    {
      name: 'fd-cart',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ items, bump, paymentMethod }) => ({ items, bump, paymentMethod }),
    },
  ),
);
