import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'inverse';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  // Brend rangidagi asosiy tugma (za'faron, to'q matn)
  primary: 'bg-brand text-on-brand hover:brightness-[1.04] active:brightness-95',
  // Kulrang tugma — ikkinchi darajali amallar
  secondary: 'bg-tile text-ink hover:brightness-[0.98] active:brightness-95',
  ghost: 'bg-transparent text-ink hover:bg-tile',
  outline: 'border border-line bg-surface text-ink hover:bg-tile',
  // Oq tugma — surat yoki rangli fon ustida
  inverse: 'bg-white text-ink hover:brightness-95',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 rounded-[12px] px-3.5 text-[13px]',
  md: 'h-12 rounded-[14px] px-5 text-[15px]',
  lg: 'h-14 rounded-[16px] px-6 text-[16px]',
};

/** Tugma klasslari — <Link> kabi boshqa elementlarni ham bir xil ko'rinishda qilish uchun */
export function buttonClasses({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
}: { variant?: Variant; size?: Size; fullWidth?: boolean; className?: string } = {}) {
  return cn(
    'inline-flex select-none items-center justify-center gap-2 font-semibold',
    'transition-[transform,filter,background-color] duration-200 ease-out-expo active:scale-[0.98]',
    'disabled:pointer-events-none disabled:opacity-45',
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    className,
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', fullWidth, loading, disabled, className, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...props}
    >
      {loading && <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {children}
    </button>
  );
});
