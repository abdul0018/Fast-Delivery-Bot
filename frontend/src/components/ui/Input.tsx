import { forwardRef, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface FieldProps {
  label?: string;
  icon?: ReactNode;
  error?: string;
}

const fieldClass =
  'w-full rounded-2xl border border-line bg-surface px-4 py-3 text-ink placeholder:text-hint outline-none transition focus:border-brand focus:ring-4 focus:ring-brand-soft';

function FieldWrapper({ label, icon, error, children }: FieldProps & { children: ReactNode }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-hint">
          {icon}
          {label}
        </span>
      )}
      {children}
      {error && <span className="mt-1 block text-xs text-sale">{error}</span>}
    </label>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & FieldProps>(function Input(
  { label, icon, error, className, ...props },
  ref,
) {
  return (
    <FieldWrapper label={label} icon={icon} error={error}>
      <input ref={ref} className={cn(fieldClass, error && 'border-sale', className)} {...props} />
    </FieldWrapper>
  );
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps>(
  function Textarea({ label, icon, error, className, ...props }, ref) {
    return (
      <FieldWrapper label={label} icon={icon} error={error}>
        <textarea ref={ref} rows={2} className={cn(fieldClass, 'resize-none', error && 'border-sale', className)} {...props} />
      </FieldWrapper>
    );
  },
);
