'use client';

import { useEffect } from 'react';
import { useUiStore } from '@/store/uiStore';

/** Ekran tepasida chiqadigan qisqa bildirishnoma */
export function Toast() {
  const toast = useUiStore((state) => state.toast);
  const hide = useUiStore((state) => state.hideToast);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(hide, 2200);
    return () => clearTimeout(timer);
  }, [toast, hide]);

  if (!toast) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[60] flex justify-center px-4">
      <div key={toast.id} className="animate-pop rounded-2xl bg-ink/90 px-4 py-2.5 text-sm font-medium text-surface shadow-xl">
        {toast.message}
      </div>
    </div>
  );
}
