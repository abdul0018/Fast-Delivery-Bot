'use client';

import { cn } from '@/lib/utils';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

/** iOS uslubidagi yoqish/o'chirish tugmasi — yoqilganda brend rangida (tanlov holati bilan bir xil) */
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
        'relative inline-flex h-[30px] w-[50px] shrink-0 items-center rounded-full transition-colors duration-300 ease-out-expo disabled:opacity-45',
        checked ? 'bg-brand' : 'bg-track',
      )}
    >
      <span
        className={cn(
          'inline-block size-[26px] rounded-full bg-white shadow-(--shadow-thumb) transition-transform duration-300 ease-out-expo',
          checked ? 'translate-x-[22px]' : 'translate-x-[2px]',
        )}
      />
    </button>
  );
}
