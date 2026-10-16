'use client';

import { cn } from '@/lib/utils';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

/** Yoqish/o'chirish tugmasi — yoqilganda yashil */
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
        'relative inline-flex h-[30px] w-[52px] shrink-0 items-center rounded-full transition-colors duration-300 ease-out-expo disabled:opacity-45',
        checked ? 'bg-accent' : 'bg-[#8f8f8f]',
      )}
    >
      <span
        className={cn(
          'inline-block size-[24px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-transform duration-300 ease-out-expo',
          checked ? 'translate-x-[25px]' : 'translate-x-[3px]',
        )}
      />
    </button>
  );
}
