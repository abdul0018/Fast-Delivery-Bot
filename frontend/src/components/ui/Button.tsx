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
  primary:
    'bg-brand text-on-brand shadow-[0_8px_18px_-10px_var(--brand)] hover:brightness-110 active:brightness-95',
  secondary: 'bg-brand-soft text-brand-ink hover:brightness-[0.98]',
  ghost: 'bg-transparent text-ink hover:bg-muted',
  outline: 'border border-line bg-surface text-ink hover:bg-muted',
  inverse: 'bg-on-brand text-brand hover:brightness-95',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm rounded-[12px]',
  md: 'h-11 px-4 text-[15px] rounded-[14px]',
  lg: 'h-[54px] px-6 text-base rounded-[16px]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', fullWidth, loading, disabled, className, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex select-none items-center justify-center gap-2 font-display font-semibold tracking-[-0.01em]',
        'transition-[transform,filter,background-color] duration-200 ease-silk active:scale-[0.98]',
        'disabled:pointer-events-none disabled:opacity-45',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {loading && <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {children}
    </button>
  );
});
