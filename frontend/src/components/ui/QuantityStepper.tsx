'use client';

import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuantityStepperProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: 'sm' | 'md';
  /** vertical — savatcha qatorida (namunadagidek ustma-ust qizil tugmalar) */
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  label?: string;
}

/** − 2 + boshqaruvi: kichik qizil kvadrat tugmalar */
export function QuantityStepper({
  value,
  onIncrement,
  onDecrement,
  size = 'md',
  orientation = 'horizontal',
  className,
  label,
}: QuantityStepperProps) {
  const button = cn(
    'flex items-center justify-center rounded-[9px] bg-brand-fill text-on-brand transition-transform duration-150 active:scale-90',
    size === 'sm' ? 'size-7' : 'size-9',
  );
  const icon = size === 'sm' ? 15 : 18;
  const vertical = orientation === 'vertical';

  return (
    <div
      role="group"
      aria-label={label}
      className={cn('inline-flex items-center gap-2', vertical && 'flex-col-reverse gap-1.5', className)}
    >
      <button type="button" aria-label="−" className={button} onClick={onDecrement}>
        <Minus size={icon} strokeWidth={2.5} />
      </button>
      <span aria-live="polite" className={cn('price min-w-5 text-center font-bold', size === 'sm' ? 'text-sm' : 'text-base')}>
        {value}
      </span>
      <button type="button" aria-label="+" className={button} onClick={onIncrement}>
        <Plus size={icon} strokeWidth={2.5} />
      </button>
    </div>
  );
}
