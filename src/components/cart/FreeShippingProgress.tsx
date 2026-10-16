import { Truck } from 'lucide-react';
import { FREE_SHIPPING_THRESHOLD } from '../../config';
import { formatPrice } from '../../utils/format';

export function FreeShippingProgress({ subtotal }: { subtotal: number }) {
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="rounded-2xl bg-gradient-to-r from-brand-50 to-violet-50 p-3.5">
      <p className="flex items-center gap-2 text-sm">
        <Truck className="size-4 shrink-0 text-brand-600" aria-hidden="true" />
        {remaining > 0 ? (
          <span>
            Add <strong>{formatPrice(remaining)}</strong> more for free shipping
          </span>
        ) : (
          <span className="font-medium text-emerald-700">You've unlocked free shipping!</span>
        )}
      </p>
      <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-white" aria-hidden="true">
        <div className={remaining > 0 ? 'bg-sunset h-full rounded-full transition-all duration-500' : 'h-full rounded-full bg-emerald-500 transition-all duration-500'} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
