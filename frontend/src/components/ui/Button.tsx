import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'outline' | 'outlineOnBrand' | 'inverse';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary: 'bg-brand-fill text-on-brand hover:brightness-105 active:brightness-95',
  accent: 'border-2 border-outline bg-accent text-on-accent hover:brightness-105',
  secondary: 'bg-brand-soft text-brand-ink hover:brightness-[0.98]',
  ghost: 'bg-transparent text-ink hover:bg-muted',
  outline: 'border-2 border-outline bg-transparent text-ink hover:bg-muted',
  // Qizil maydon ustidagi konturli tugma
  outlineOnBrand: 'border-2 border-on-brand bg-transparent text-on-brand hover:bg-on-brand/10',
  inverse: 'bg-on-brand text-brand-ink hover:brightness-95',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-[13px]',
  md: 'h-11 px-5 text-[14px]',
  lg: 'h-[54px] px-6 text-[15px]',
};

/** Tugma klasslari — <Link> kabi boshqa elementlarni ham bir xil ko'rinishda qilish uchun */
export function buttonClasses({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
}: { variant?: Variant; size?: Size; fullWidth?: boolean; className?: string } = {}) {
  return cn(
    'inline-flex select-none items-center justify-center gap-2 rounded-full font-display font-extrabold uppercase tracking-[0.01em]',
    'transition-[transform,filter,background-color] duration-200 ease-pop active:scale-[0.97]',
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
