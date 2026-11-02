'use client';

/** Admin panel: umumiy yorliqlar (rus tilida), bildirishnoma (toast) va kichik UI bo'laklari */
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { AlertCircle, Check } from 'lucide-react';
import type { OrderStatus } from '@/types';
import { cn, formatPrice } from '@/lib/utils';

export const CATEGORY_LABELS: Record<string, string> = {
  smoked: 'Копчёная рыба',
  salmon: 'Лосось',
  delicacy: 'Деликатесы',
  caviar: 'Икра',
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'Новый',
  confirmed: 'Готовится',
  delivering: 'В пути',
  completed: 'Доставлен',
  cancelled: 'Отменён',
};

/** Holatni o'zgartirish tugmalari matni */
export const STATUS_ACTIONS: Record<OrderStatus, string> = {
  new: 'Новый',
  confirmed: 'Принять',
  delivering: 'Отправить',
  completed: 'Доставлен',
  cancelled: 'Отменить',
};

export const som = (amount: number) => `${formatPrice(amount)} сум`;

/** Katta summalarni qisqa yozish: 1 250 000 -> "1,25 млн" */
export const compactSom = (amount: number) => {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(amount >= 10_000_000 ? 1 : 2).replace('.', ',').replace(/,?0+$/, '')} млн`;
  if (amount >= 1000) return `${Math.round(amount / 1000)} тыс`;
  return String(amount);
};

// ------------------------------------------------------------------ Toast

type Tone = 'ok' | 'error';
const ToastContext = createContext<(message: string, tone?: Tone) => void>(() => {});
export const useAdminToast = () => useContext(ToastContext);

export function AdminToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ id: number; message: string; tone: Tone } | null>(null);
  const show = useCallback((message: string, tone: Tone = 'ok') => setToast({ id: Date.now(), message, tone }), []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), toast.tone === 'error' ? 4500 : 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <ToastContext.Provider value={show}>
      {children}
      {toast && (
        <div role="status" className="pointer-events-none fixed inset-x-0 top-3 z-[80] flex justify-center px-4">
          <div
            key={toast.id}
            className="flex max-w-md animate-rise items-start gap-2.5 rounded-[16px] bg-surface py-2.5 pr-4 pl-2.5 text-[14px] font-medium text-ink shadow-(--shadow-float)"
          >
            <span
              className={cn(
                'mt-px flex size-6 shrink-0 items-center justify-center rounded-full text-white',
                toast.tone === 'ok' ? 'bg-ok' : 'bg-sale',
              )}
            >
              {toast.tone === 'ok' ? <Check size={14} strokeWidth={3} /> : <AlertCircle size={15} strokeWidth={2.5} />}
            </span>
            <span className="pt-0.5">{toast.message}</span>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

// ------------------------------------------------------------------ UI

/** Gorizontal tanlov "chip"lari (kategoriya, holat, davr) */
export function Chips<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string; count?: number }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-0.5">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[14px] font-medium transition-colors duration-200',
              active ? 'bg-ink text-white' : 'bg-surface text-ink',
            )}
          >
            {option.label}
            {option.count != null && option.count > 0 && (
              <span className={cn('price text-[12px]', active ? 'text-white/70' : 'text-ink-2')}>{option.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function EmptyState({ icon, title, text }: { icon: ReactNode; title: string; text?: string }) {
  return (
    <div className="flex flex-col items-center rounded-[20px] bg-surface px-6 py-10 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-tile text-ink-2">{icon}</div>
      <p className="mt-4 text-[17px] font-semibold">{title}</p>
      {text && <p className="mt-1 text-[14px] text-ink-2">{text}</p>}
    </div>
  );
}

export function ListSkeleton({ rows = 4, height = 'h-20' }: { rows?: number; height?: string }) {
  return (
    <div className="space-y-2.5" aria-hidden>
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className={cn('animate-pulse rounded-[20px] bg-surface', height)} />
      ))}
    </div>
  );
}
