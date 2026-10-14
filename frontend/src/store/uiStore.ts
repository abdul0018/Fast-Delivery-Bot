/**
 * UI holati: ochiq mahsulot (Bottom Sheet) va qisqa bildirishnomalar (toast).
 */
import { create } from 'zustand';
import type { Product } from '@/types';

interface UiState {
  activeProduct: Product | null;
  toast: { id: number; message: string } | null;
  openProduct: (product: Product) => void;
  closeProduct: () => void;
  showToast: (message: string) => void;
  hideToast: () => void;
}

export const useUiStore = create<UiState>()((set) => ({
  activeProduct: null,
  toast: null,
  openProduct: (product) => set({ activeProduct: product }),
  closeProduct: () => set({ activeProduct: null }),
  showToast: (message) => set({ toast: { id: Date.now(), message } }),
  hideToast: () => set({ toast: null }),
}));
