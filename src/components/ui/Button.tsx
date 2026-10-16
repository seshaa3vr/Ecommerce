import { LoaderCircle } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '../../utils/cn';

type Variant = 'primary' | 'dark' | 'secondary' | 'ghost' | 'accent' | 'inverse' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonStyle {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  // Gradient slides on hover; the deep gradient keeps white text readable end to end.
  primary:
    'bg-sunset-deep bg-[length:200%_100%] bg-left text-white shadow-lg shadow-fuchsia-700/25 hover:-translate-y-0.5 hover:bg-right hover:shadow-fuchsia-700/40 active:translate-y-0',
  dark: 'bg-stone-900 text-white hover:bg-stone-700',
  secondary: 'border border-stone-300 bg-white text-stone-900 hover:border-brand-500 hover:text-brand-700',
  ghost: 'text-stone-700 hover:bg-stone-100 hover:text-stone-900',
  accent: 'bg-brand-600 text-white hover:bg-brand-700',
  inverse: 'bg-white text-stone-900 shadow-lg hover:-translate-y-0.5 hover:bg-brand-50',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-12 px-8 text-base',
};

/** Button styling, also used to make router links look like buttons. */
export function buttonClasses({ variant = 'primary', size = 'md', fullWidth = false }: ButtonStyle = {}) {
  return cn(
    'inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-all duration-300',
    'disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
  );
}

interface ButtonProps extends ComponentProps<'button'>, ButtonStyle {
  loading?: boolean;
}

export function Button({ variant, size, fullWidth, loading = false, className, children, disabled, type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonClasses({ variant, size, fullWidth }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
