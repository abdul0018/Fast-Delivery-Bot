'use client';

import { cn } from '@/lib/utils';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

/** Yoqish/o'chirish tugmasi — yoqilganda brend rangida */
export function Switch({ checked, onChange, label, disabled }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-[30px] w-[52px] shrink-0 items-center rounded-full transition-colors duration-300 ease-silk disabled:opacity-45',
        checked ? 'bg-brand' : 'bg-ink-2/30',
      )}
    >
      <span
        className={cn(
          'inline-block size-[26px] rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.22)] transition-transform duration-300 ease-silk',
          checked ? 'translate-x-[24px]' : 'translate-x-[2px]',
        )}
      />
    </button>
  );
}
