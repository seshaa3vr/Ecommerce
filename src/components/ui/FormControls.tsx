import { useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

const controlClasses = (error?: string) =>
  cn(
    'block w-full rounded-lg border bg-white px-3.5 text-base text-stone-900 placeholder:text-stone-400 sm:text-sm',
    'transition-shadow focus:ring-4 focus:outline-none',
    error ? 'border-red-500 focus:ring-red-500/15' : 'border-stone-300 focus:border-stone-900 focus:ring-stone-900/10',
  );

function Field({ id, label, error, hint, className, children }: { id: string; label: string; error?: string; hint?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-stone-800">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-message`} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-message`} className="mt-1.5 text-sm text-stone-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

interface FieldProps {
  label: string;
  error?: string;
  hint?: ReactNode;
}

export function Select({ label, error, hint, className, children, ...props }: ComponentProps<'select'> & FieldProps) {
  const id = useId();
  return (
    <Field id={id} label={label} error={error} hint={hint} className={className}>
      <select id={id} aria-invalid={error ? true : undefined} aria-describedby={error || hint ? `${id}-message` : undefined} className={cn(controlClasses(error), 'h-11 pr-9')} {...props}>
        {children}
      </select>
    </Field>
  );
}

export function Textarea({ label, error, hint, className, ...props }: ComponentProps<'textarea'> & FieldProps) {
  const id = useId();
  return (
    <Field id={id} label={label} error={error} hint={hint} className={className}>
      <textarea id={id} aria-invalid={error ? true : undefined} aria-describedby={error || hint ? `${id}-message` : undefined} className={cn(controlClasses(error), 'min-h-28 py-2.5')} {...props} />
    </Field>
  );
}
