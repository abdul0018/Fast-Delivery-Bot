/**
 * UI holati: ochiq mahsulot (Bottom Sheet), manzil/telefon tahrirlash paneli, xaritadan manzil tanlash
 * va qisqa bildirishnomalar (toast).
 */
import { create } from 'zustand';
import type { GeoPoint, Product } from '@/types';

export interface PickedLocation {
  point: GeoPoint;
  /** Ko'cha manzili (topilmasa — null) */
  address: string | null;
}

interface MapRequest {
  initial: GeoPoint | null;
  /** initial nuqtaning aniqligi (metr) — taxminiy bo'lsa xaritada doira va maslahat ko'rsatiladi */
  accuracy?: number | null;
  onPick: (picked: PickedLocation) => void;
}

interface UiState {
  activeProduct: Product | null;
  contactsOpen: boolean;
  mapRequest: MapRequest | null;
  toast: { id: number; message: string } | null;
  openProduct: (product: Product) => void;
  closeProduct: () => void;
  openContacts: () => void;
  closeContacts: () => void;
  openMap: (request: MapRequest) => void;
  closeMap: () => void;
  showToast: (message: string) => void;
  hideToast: () => void;
}

export const useUiStore = create<UiState>()((set) => ({
  activeProduct: null,
  contactsOpen: false,
  mapRequest: null,
  toast: null,
  openProduct: (product) => set({ activeProduct: product }),
  closeProduct: () => set({ activeProduct: null }),
  openContacts: () => set({ contactsOpen: true }),
  closeContacts: () => set({ contactsOpen: false }),
  openMap: (request) => set({ mapRequest: request }),
  closeMap: () => set({ mapRequest: null }),
  showToast: (message) => set({ toast: { id: Date.now(), message } }),
  hideToast: () => set({ toast: null }),
}));
