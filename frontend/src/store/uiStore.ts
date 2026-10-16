/**
 * UI holati: ochiq mahsulot (Bottom Sheet), manzil/telefon tahrirlash paneli va qisqa bildirishnomalar (toast).
 */
import { create } from 'zustand';
import type { Product } from '@/types';

interface UiState {
  activeProduct: Product | null;
  contactsOpen: boolean;
  toast: { id: number; message: string } | null;
  openProduct: (product: Product) => void;
  closeProduct: () => void;
  openContacts: () => void;
  closeContacts: () => void;
  showToast: (message: string) => void;
  hideToast: () => void;
}

export const useUiStore = create<UiState>()((set) => ({
  activeProduct: null,
  contactsOpen: false,
  toast: null,
  openProduct: (product) => set({ activeProduct: product }),
  closeProduct: () => set({ activeProduct: null }),
  openContacts: () => set({ contactsOpen: true }),
  closeContacts: () => set({ contactsOpen: false }),
  showToast: (message) => set({ toast: { id: Date.now(), message } }),
  hideToast: () => set({ toast: null }),
}));
