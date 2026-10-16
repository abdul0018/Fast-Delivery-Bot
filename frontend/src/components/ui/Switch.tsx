'use client';

import { cn } from '@/lib/utils';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

/** Yoqish/o'chirish tugmasi — konturli, yoqilganda yashil */
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
        'relative inline-flex h-[32px] w-[56px] shrink-0 items-center rounded-full border-2 border-outline transition-colors duration-300 ease-pop disabled:opacity-45',
        checked ? 'bg-ok' : 'bg-surface',
      )}
    >
      <span
        className={cn(
          'inline-block size-[22px] rounded-full border-2 border-outline transition-transform duration-300 ease-pop',
          checked ? 'translate-x-[27px] bg-surface' : 'translate-x-[3px] bg-accent',
        )}
      />
    </button>
  );
}
