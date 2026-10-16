import { Minus, Plus } from 'lucide-react';
import { cn } from '../../utils/cn';

interface QuantityPickerProps {
  value: number;
  max: number;
  min?: number;
  onChange: (value: number) => void;
  size?: 'sm' | 'md';
  label?: string;
}

export function QuantityPicker({ value, max, min = 1, onChange, size = 'md', label = 'Quantity' }: QuantityPickerProps) {
  const button = cn(
    'grid place-items-center text-stone-700 transition-colors hover:bg-stone-100 disabled:cursor-not-allowed disabled:text-stone-300 disabled:hover:bg-transparent',
    size === 'sm' ? 'size-8' : 'size-11',
  );

  return (
    <div className="inline-flex items-center rounded-full border border-stone-300" role="group" aria-label={label}>
      <button type="button" className={cn(button, 'rounded-l-full')} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Decrease quantity">
        <Minus className="size-4" />
      </button>
      <span className={cn('text-center font-medium tabular-nums', size === 'sm' ? 'w-7 text-sm' : 'w-9')} aria-live="polite">
        {value}
      </span>
      <button type="button" className={cn(button, 'rounded-r-full')} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        <Plus className="size-4" />
      </button>
    </div>
  );
}
