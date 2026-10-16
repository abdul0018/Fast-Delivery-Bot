import { forwardRef, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface FieldProps {
  label?: string;
  icon?: ReactNode;
  error?: string;
}

const fieldClass =
  'w-full rounded-[18px] border-2 border-outline bg-surface px-4 py-3 text-ink placeholder:text-ink-2/70 outline-none transition-[box-shadow] duration-200 focus:shadow-[0_0_0_4px_var(--accent)]';

function FieldWrapper({ label, icon, error, id, children }: FieldProps & { id?: string; children: ReactNode }) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="mb-1.5 flex items-center gap-1.5 text-[13px] font-bold text-ink-2 uppercase">
          {icon}
          {label}
        </label>
      )}
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-[13px] font-bold text-sale">
          {error}
        </p>
      )}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & FieldProps>(function Input(
  { label, icon, error, className, id, ...props },
  ref,
) {
  return (
    <FieldWrapper label={label} icon={icon} error={error} id={id}>
      <input ref={ref} id={id} aria-invalid={Boolean(error) || undefined} className={cn(fieldClass, error && 'border-sale', className)} {...props} />
    </FieldWrapper>
  );
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps>(
  function Textarea({ label, icon, error, className, id, ...props }, ref) {
    return (
      <FieldWrapper label={label} icon={icon} error={error} id={id}>
        <textarea
          ref={ref}
          id={id}
          rows={2}
          aria-invalid={Boolean(error) || undefined}
          className={cn(fieldClass, 'resize-none', error && 'border-sale', className)}
          {...props}
        />
      </FieldWrapper>
    );
  },
);
