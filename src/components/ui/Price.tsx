import { cn } from '../../utils/cn';
import { discountPercent, formatPrice } from '../../utils/format';

interface PriceProps {
  price: number;
  originalPrice?: number;
  size?: 'sm' | 'lg';
  className?: string;
}

export function Price({ price, originalPrice, size = 'sm', className }: PriceProps) {
  const discount = discountPercent(price, originalPrice);

  return (
    <div className={cn('flex flex-wrap items-baseline gap-x-2 gap-y-0.5', className)}>
      <span className={cn('font-semibold text-stone-900', size === 'lg' ? 'text-2xl' : 'text-sm')}>
        {formatPrice(price)}
      </span>
      {discount > 0 && (
        <>
          <span className={cn('text-stone-400 line-through', size === 'lg' ? 'text-base' : 'text-xs')}>
            <span className="sr-only">Was </span>
            {formatPrice(originalPrice!)}
          </span>
          <span className={cn('font-semibold text-brand-600', size === 'lg' ? 'text-base' : 'text-xs')}>{discount}% off</span>
        </>
      )}
    </div>
  );
}
