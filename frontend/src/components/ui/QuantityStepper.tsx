'use client';

import { Minus, Plus, Trash2 } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { cn } from '@/lib/utils';

interface QuantityStepperProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: 'sm' | 'md' | 'lg';
  /** brand — kartochka ustida (za'faron), neutral — kulrang */
  tone?: 'neutral' | 'brand';
  /** 1 da "−" o'rniga savatdan o'chirish ikonkasini ko'rsatish */
  removeAtOne?: boolean;
  className?: string;
  label?: string;
}

const SIZES = {
  sm: { box: 'h-8', btn: 'w-8', icon: 15, text: 'text-[14px] min-w-5' },
  md: { box: 'h-10', btn: 'w-10', icon: 17, text: 'text-[15px] min-w-6' },
  lg: { box: 'h-14', btn: 'w-12', icon: 19, text: 'text-[17px] min-w-7' },
} as const;

/** − 2 + boshqaruvi: bitta yumaloq "tabletka" ichida */
export function QuantityStepper({
  value,
  onIncrement,
  onDecrement,
  size = 'md',
  tone = 'neutral',
  removeAtOne = false,
  className,
  label,
}: QuantityStepperProps) {
  const { t } = useI18n();
  const s = SIZES[size];
  const showRemove = removeAtOne && value <= 1;

  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        'inline-flex items-center rounded-full',
        s.box,
        tone === 'brand' ? 'bg-brand text-on-brand' : 'bg-tile text-ink',
        size === 'lg' && 'rounded-[16px]',
        className,
      )}
    >
      <button
        type="button"
        aria-label={showRemove ? t('cart.remove') : t('common.decrease')}
        className={cn('flex h-full items-center justify-center transition-transform duration-150 active:scale-90', s.btn)}
        onClick={onDecrement}
      >
        {showRemove ? <Trash2 size={s.icon - 1} strokeWidth={2} /> : <Minus size={s.icon} strokeWidth={2.25} />}
      </button>
      <span aria-live="polite" className={cn('price text-center font-semibold', s.text)}>
        {value}
      </span>
      <button
        type="button"
        aria-label={t('common.increase')}
        className={cn('flex h-full items-center justify-center transition-transform duration-150 active:scale-90', s.btn)}
        onClick={onIncrement}
      >
        <Plus size={s.icon} strokeWidth={2.25} />
      </button>
    </div>
  );
}
