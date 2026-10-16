import { useId, type ComponentProps, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends ComponentProps<'input'> {
  label: string;
  error?: string;
  hint?: ReactNode;
  /** Rendered inside the field on the right, e.g. a show-password toggle. */
  trailing?: ReactNode;
}

export function Input({ label, error, hint, trailing, id, className, ...props }: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const messageId = `${inputId}-message`;

  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-stone-800">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? messageId : undefined}
          className={cn(
            // 16px text on phones stops iOS from zooming into the field.
            'block h-11 w-full rounded-lg border bg-white px-3.5 text-base text-stone-900 placeholder:text-stone-400 sm:text-sm',
            'transition-shadow focus:ring-4 focus:outline-none',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/15'
              : 'border-stone-300 focus:border-stone-900 focus:ring-stone-900/10',
            trailing ? 'pr-11' : undefined,
          )}
          {...props}
        />
        {trailing && <div className="absolute inset-y-0 right-0 flex items-center pr-1.5">{trailing}</div>}
      </div>
      {error ? (
        <p id={messageId} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="mt-1.5 text-sm text-stone-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
