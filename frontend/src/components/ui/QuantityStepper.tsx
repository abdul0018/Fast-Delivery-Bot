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

/** − 2 + boshqaruvi: konturli kapsula, "+" xantal doira */
export function QuantityStepper({ value, onIncrement, onDecrement, size = 'md', className, label }: QuantityStepperProps) {
  const button = cn(
    'flex items-center justify-center rounded-full transition-transform duration-150 active:scale-90',
    size === 'sm' ? 'size-8' : 'size-10',
  );
  const icon = size === 'sm' ? 16 : 18;

  return (
    <div
      role="group"
      aria-label={label}
      className={cn('inline-flex items-center gap-1 rounded-full border-2 border-outline bg-surface p-0.5', className)}
    >
      <button type="button" aria-label="−" className={cn(button, 'text-ink hover:bg-muted')} onClick={onDecrement}>
        <Minus size={icon} strokeWidth={2.5} />
      </button>
      <span aria-live="polite" className={cn('price min-w-6 text-center font-black', size === 'sm' ? 'text-sm' : 'text-base')}>
        {value}
      </span>
      <button type="button" aria-label="+" className={cn(button, 'bg-accent text-on-accent')} onClick={onIncrement}>
        <Plus size={icon} strokeWidth={2.5} />
      </button>
    </div>
  );
}
