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
        className="flex animate-rise items-center gap-2 rounded-full bg-brand-fill px-4 py-2.5 text-sm font-semibold text-on-brand shadow-[0_8px_24px_-10px_rgba(224,0,0,0.6)]"
      >
        <span className="flex size-5 items-center justify-center rounded-full bg-white text-ok">
          <Check size={13} strokeWidth={3} />
        </span>
        {toast.message}
      </div>
    </div>
  );
}
