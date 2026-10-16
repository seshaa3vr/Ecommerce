import type { ReactNode } from 'react';
import { TAX_LABEL } from '../../config';
import type { CartTotals } from '../../types';
import { formatPrice } from '../../utils/format';

export function OrderSummary({ totals, children }: { totals: CartTotals; children?: ReactNode }) {
  return (
    <div>
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-stone-600">
            Subtotal ({totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'})
          </dt>
          <dd className="font-medium">{formatPrice(totals.subtotal)}</dd>
        </div>
        {totals.savings > 0 && (
          <div className="flex justify-between text-emerald-700">
            <dt>You save</dt>
            <dd className="font-medium">−{formatPrice(totals.savings)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-stone-600">Shipping</dt>
          <dd className="font-medium">{totals.shipping === 0 ? <span className="text-emerald-700">Free</span> : formatPrice(totals.shipping)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-stone-600">{TAX_LABEL}</dt>
          <dd className="font-medium">{formatPrice(totals.tax)}</dd>
        </div>
        <div className="flex justify-between border-t border-stone-200 pt-3 text-base">
          <dt className="font-semibold">Total</dt>
          <dd className="font-semibold">{formatPrice(totals.total)}</dd>
        </div>
      </dl>
      {children}
    </div>
  );
}
