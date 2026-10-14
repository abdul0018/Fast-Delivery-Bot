'use client';

import { useEffect } from 'react';
import { useCatalogStore } from '@/store/catalogStore';

/** Mahsulotlar va konfiguratsiyani yuklash (bir marta, keshlangan) */
export function useCatalog() {
  const products = useCatalogStore((state) => state.products);
  const config = useCatalogStore((state) => state.config);
  const status = useCatalogStore((state) => state.status);
  const error = useCatalogStore((state) => state.error);
  const load = useCatalogStore((state) => state.load);

  useEffect(() => {
    void load();
  }, [load]);

  return { products, config, status, error, reload: () => load(true) };
}
