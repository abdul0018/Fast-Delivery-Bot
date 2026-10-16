'use client';

import { useEffect } from 'react';
import { Check } from 'lucide-react';
import { useUiStore } from '@/store/uiStore';

/** Ekran tepasida chiqadigan qisqa bildirishnoma — oq suzuvchi karta */
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
        className="flex animate-rise items-center gap-2.5 rounded-[16px] bg-surface py-2.5 pr-4 pl-2.5 text-[14px] font-medium text-ink shadow-(--shadow-float)"
      >
        <span className="flex size-6 items-center justify-center rounded-full bg-ok text-white">
          <Check size={14} strokeWidth={3} />
        </span>
        {toast.message}
      </div>
    </div>
  );
}
