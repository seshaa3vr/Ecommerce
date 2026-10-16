import { ChevronRight, Search, Truck } from 'lucide-react';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { AdminPageHeader } from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/Button';
import { PageLoader } from '../../components/ui/Loading';
import { OrderStatusBadge } from '../../components/ui/OrderStatusBadge';
import { useApi } from '../../hooks/useApi';
import { usePageTitle } from '../../hooks/usePageTitle';
import { api, errorMessage } from '../../lib/api';
import { toast } from '../../store/toastStore';
import type { Order, OrderStatus } from '../../types';
import { cn } from '../../utils/cn';
import { formatDate, formatPrice } from '../../utils/format';

const tabs: { id: OrderStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'delivered', label: 'Delivered' },
];

export function OrdersPage() {
  usePageTitle('Orders · Admin');
  const { data, loading, error, reload, mutate } = useApi<{ orders: Order[] }>('/admin/orders');
  const [params, setParams] = useSearchParams();
  const status = (tabs.find((t) => t.id === params.get('status'))?.id ?? 'all') as OrderStatus | 'all';
  const [query, setQuery] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  if (loading) return <PageLoader />;
  if (error) {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-red-50 p-4 text-sm text-red-800" role="alert">
        {error}
        <Button size="sm" variant="secondary" onClick={reload}>
          Try again
        </Button>
      </div>
    );
  }

  const orders = data?.orders ?? [];
  const q = query.trim().toLowerCase();
  const visible = orders.filter(
    (o) =>
      (status === 'all' || o.status === status) &&
      (!q || [o.id, o.shipping.fullName, o.userEmail, o.shipping.phone].some((field) => field.toLowerCase().includes(q))),
  );
  const count = (id: OrderStatus | 'all') => (id === 'all' ? orders.length : orders.filter((o) => o.status === id).length);

  const markDelivered = async (order: Order) => {
    setUpdating(order.id);
    try {
      const { order: updated } = await api<{ order: Order }>(`/admin/orders/${order.id}`, { method: 'PATCH', body: { status: 'delivered' } });
      mutate((current) => current && { orders: current.orders.map((o) => (o.id === updated.id ? updated : o)) });
      toast.success(`Order #${order.id} marked as delivered`);
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setUpdating(null);
    }
  };

  return (
    <>
      <AdminPageHeader title="Orders" description="Every order placed by your customers." />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div role="tablist" aria-label="Filter by status" className="flex rounded-xl bg-stone-200/60 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={status === tab.id}
              onClick={() => setParams(tab.id === 'all' ? {} : { status: tab.id }, { replace: true })}
              className={cn(
                'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors sm:flex-none',
                status === tab.id ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900',
              )}
            >
              {tab.label}
              <span className="text-xs text-stone-400 tabular-nums">{count(tab.id)}</span>
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-stone-400" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order no., name, email or phone"
            aria-label="Search orders"
            className="h-11 w-full rounded-lg border border-stone-300 bg-white pr-3 pl-10 text-base focus:border-stone-900 focus:ring-4 focus:ring-stone-900/10 focus:outline-none sm:text-sm"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div
          aria-hidden="true"
          className="hidden grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_6rem_7rem_7rem_9rem] gap-x-4 border-b border-stone-200 bg-stone-50 px-4 py-2.5 text-xs font-semibold tracking-wide text-stone-500 uppercase md:grid"
        >
          <span>Order</span>
          <span>Customer</span>
          <span>Items</span>
          <span className="text-right">Total</span>
          <span>Status</span>
          <span />
        </div>
        {visible.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-stone-500">{orders.length === 0 ? 'No orders yet.' : 'No orders match.'}</p>
        ) : (
          <ul className="divide-y divide-stone-100">
            {visible.map((order) => (
              <li
                key={order.id}
                className="grid grid-cols-2 gap-x-4 gap-y-2 p-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_6rem_7rem_7rem_9rem] md:items-center md:py-3"
              >
                <div className="min-w-0">
                  <Link to={`/admin/orders/${order.id}`} className="text-sm font-semibold hover:underline">
                    #{order.id}
                  </Link>
                  <p className="text-xs text-stone-500">{formatDate(order.createdAt, { dateStyle: 'medium', timeStyle: 'short' })}</p>
                </div>
                <div className="min-w-0 text-right md:text-left">
                  <p className="truncate text-sm font-medium">{order.shipping.fullName}</p>
                  <p className="truncate text-xs text-stone-500">{order.userEmail}</p>
                </div>
                <p className="text-sm text-stone-600">
                  {order.totals.itemCount} {order.totals.itemCount === 1 ? 'item' : 'items'}
                </p>
                <p className="text-right text-sm font-semibold tabular-nums">{formatPrice(order.totals.total)}</p>
                <div>
                  <OrderStatusBadge status={order.status} audience="admin" />
                </div>
                <div className="flex items-center justify-end gap-1">
                  {order.status === 'pending' && (
                    <Button size="sm" variant="secondary" onClick={() => markDelivered(order)} loading={updating === order.id} title="Mark as delivered">
                      {updating !== order.id && <Truck className="size-4" aria-hidden="true" />}
                      Delivered
                    </Button>
                  )}
                  <Link to={`/admin/orders/${order.id}`} className="grid size-9 place-items-center rounded-full text-stone-600 hover:bg-stone-100" aria-label={`View order ${order.id}`}>
                    <ChevronRight className="size-4" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
