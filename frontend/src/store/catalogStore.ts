/**
 * Katalog: mahsulotlar va ilova konfiguratsiyasi (to'lov usullari, Order Bump).
 * Bir marta yuklanadi va sahifalar o'rtasida keshlanadi.
 */
import { create } from 'zustand';
import { api, ApiError } from '@/lib/api';
import type { AppConfig, Product } from '@/types';
import { useCartStore } from './cartStore';

type Status = 'idle' | 'loading' | 'ready' | 'error';

interface CatalogState {
  products: Product[];
  config: AppConfig | null;
  status: Status;
  error: string | null;
  load: (force?: boolean) => Promise<void>;
}

export const useCatalogStore = create<CatalogState>()((set, get) => ({
  products: [],
  config: null,
  status: 'idle',
  error: null,

  load: async (force = false) => {
    const { status } = get();
    if (!force && (status === 'loading' || status === 'ready')) return;

    set({ status: 'loading', error: null });
    try {
      const [products, config] = await Promise.all([api.getProducts(), api.getConfig()]);
      useCartStore.getState().syncProducts(products);
      set({ products, config, status: 'ready' });
    } catch (error) {
      set({ status: 'error', error: error instanceof ApiError ? error.code : 'generic' });
    }
  },
}));
