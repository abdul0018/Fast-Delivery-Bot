'use client';

import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuantityStepperProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: 'sm' | 'md';
  className?: string;
  label?: string;
}

/** − 2 + boshqaruvi */
export function QuantityStepper({ value, onIncrement, onDecrement, size = 'md', className, label }: QuantityStepperProps) {
  const button = cn(
    'flex items-center justify-center rounded-[10px] transition-[transform,background-color] duration-150 active:scale-90',
    size === 'sm' ? 'size-8' : 'size-10',
  );
  const icon = size === 'sm' ? 16 : 18;

  return (
    <div
      role="group"
      aria-label={label}
      className={cn('inline-flex items-center gap-0.5 rounded-[13px] border border-line bg-surface p-0.5', className)}
    >
      <button type="button" aria-label="−" className={cn(button, 'text-ink hover:bg-muted')} onClick={onDecrement}>
        <Minus size={icon} strokeWidth={2} />
      </button>
      <span
        aria-live="polite"
        className={cn('price min-w-7 text-center font-semibold', size === 'sm' ? 'text-sm' : 'text-base')}
      >
        {value}
      </span>
      <button type="button" aria-label="+" className={cn(button, 'bg-brand text-on-brand')} onClick={onIncrement}>
        <Plus size={icon} strokeWidth={2} />
      </button>
    </div>
  );
}
