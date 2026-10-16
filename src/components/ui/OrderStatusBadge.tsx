import type { OrderStatus } from '../../types';
import { cn } from '../../utils/cn';

// Customers see a paid, not-yet-delivered order as "Confirmed"; the admin sees it as work still "Pending".
const labels: Record<'customer' | 'admin', Record<OrderStatus, string>> = {
  customer: { pending: 'Confirmed', delivered: 'Delivered' },
  admin: { pending: 'Pending', delivered: 'Delivered' },
};

export function OrderStatusBadge({ status, audience = 'customer' }: { status: OrderStatus; audience?: 'customer' | 'admin' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1',
        status === 'delivered'
          ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
          : audience === 'admin'
            ? 'bg-amber-50 text-amber-800 ring-amber-200'
            : 'bg-sky-50 text-sky-700 ring-sky-200',
      )}
    >
      <span className={cn('size-1.5 rounded-full', status === 'delivered' ? 'bg-emerald-500' : audience === 'admin' ? 'bg-amber-500' : 'bg-sky-500')} />
      {labels[audience][status]}
    </span>
  );
}
