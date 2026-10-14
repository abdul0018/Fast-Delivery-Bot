'use client';

import { cn } from '@/lib/utils';

interface QuantityStepperProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: 'sm' | 'md';
  className?: string;
}

/** − 2 + boshqaruvi */
export function QuantityStepper({ value, onIncrement, onDecrement, size = 'md', className }: QuantityStepperProps) {
  const button = cn(
    'flex items-center justify-center rounded-full font-bold transition active:scale-90',
    size === 'sm' ? 'size-7 text-base' : 'size-9 text-lg',
  );

  return (
    <div className={cn('inline-flex items-center gap-1 rounded-full bg-muted p-1', className)}>
      <button type="button" aria-label="−" className={cn(button, 'bg-surface text-ink shadow-sm')} onClick={onDecrement}>
        −
      </button>
      <span className={cn('min-w-6 text-center font-semibold tabular-nums', size === 'sm' ? 'text-sm' : 'text-base')}>
        {value}
      </span>
      <button type="button" aria-label="+" className={cn(button, 'bg-brand text-white')} onClick={onIncrement}>
        +
      </button>
    </div>
  );
}
