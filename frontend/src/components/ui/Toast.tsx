'use client';

import { useEffect } from 'react';
import { Check } from 'lucide-react';
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
    <div role="status" className="pointer-events-none fixed inset-x-0 top-3 z-[60] flex justify-center px-4">
      <div
        key={toast.id}
        className="flex animate-rise items-center gap-2 rounded-[14px] bg-ink px-4 py-2.5 text-sm font-medium text-ground shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)]"
      >
        <Check size={16} strokeWidth={1.75} className="text-silk-3" />
        {toast.message}
      </div>
    </div>
  );
}
