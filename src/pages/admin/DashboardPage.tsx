import { ClipboardList, IndianRupee, Package, Truck, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router';
import { AdminPageHeader } from '../../components/admin/AdminLayout';
import { PageLoader } from '../../components/ui/Loading';
import { OrderStatusBadge } from '../../components/ui/OrderStatusBadge';
import { useApi } from '../../hooks/useApi';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useProducts } from '../../store/catalogStore';
import type { AdminStats, Order } from '../../types';
import { cn } from '../../utils/cn';
import { formatDate, formatPrice } from '../../utils/format';

function StatCard({ label, value, note, icon: Icon, tint, to }: { label: string; value: string; note?: string; icon: LucideIcon; tint: string; to: string }) {
  return (
    <Link to={to} className="rounded-2xl border border-stone-200 bg-white p-5 transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-stone-500">{label}</p>
        <span className={cn('grid size-9 place-items-center rounded-xl', tint)}>
          <Icon className="size-4.5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      {note && <p className="mt-1 text-xs text-stone-500">{note}</p>}
    </Link>
  );
}

export function DashboardPage() {
  usePageTitle('Admin dashboard');
  const stats = useApi<{ stats: AdminStats }>('/admin/stats');
  const orders = useApi<{ orders: Order[] }>('/admin/orders');
  const lowStock = useProducts()
    .filter((p) => p.stock <= 5)
    .sort((a, b) => a.stock - b.stock);

  if (stats.loading || orders.loading) return <PageLoader />;
  const s = stats.data?.stats;
  const recent = orders.data?.orders.slice(0, 6) ?? [];

  return (
    <>
      <AdminPageHeader title="Dashboard" description="An overview of your store." />

      {s && (
        <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total sales" value={formatPrice(s.revenue)} note="All orders, incl. tax and shipping" icon={IndianRupee} tint="bg-emerald-50 text-emerald-700" to="/admin/orders" />
          <StatCard label="Orders" value={String(s.orders)} icon={ClipboardList} tint="bg-sky-50 text-sky-700" to="/admin/orders" />
          <StatCard label="Awaiting delivery" value={String(s.pendingOrders)} icon={Truck} tint="bg-amber-50 text-amber-700" to="/admin/orders?status=pending" />
          <StatCard
            label="Products"
            value={String(s.products)}
            note={s.lowStockProducts ? `${s.lowStockProducts} low on stock` : 'Stock levels healthy'}
            icon={Package}
            tint="bg-brand-50 text-brand-700"
            to="/admin/products"
          />
        </div>
      )}

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_22rem]">
        <section aria-labelledby="recent-orders" className="rounded-2xl border border-stone-200 bg-white">
          <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
            <h2 id="recent-orders" className="font-semibold">
              Recent orders
            </h2>
            <Link to="/admin/orders" className="text-sm font-medium text-stone-600 hover:text-stone-900">
              View all
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-stone-500">No orders yet. They'll appear here as customers check out.</p>
          ) : (
            <ul className="divide-y divide-stone-100">
              {recent.map((order) => (
                <li key={order.id}>
                  <Link to={`/admin/orders/${order.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3.5 hover:bg-stone-50">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">#{order.id}</p>
                      <p className="truncate text-xs text-stone-500">
                        {order.shipping.fullName} · {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <OrderStatusBadge status={order.status} audience="admin" />
                    <p className="w-24 text-right text-sm font-semibold tabular-nums">{formatPrice(order.totals.total)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="low-stock" className="rounded-2xl border border-stone-200 bg-white">
          <h2 id="low-stock" className="border-b border-stone-200 px-5 py-4 font-semibold">
            Low stock
          </h2>
          {lowStock.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-stone-500">Every product has more than 5 in stock.</p>
          ) : (
            <ul className="divide-y divide-stone-100">
              {lowStock.map((product) => (
                <li key={product.id}>
                  <Link to={`/admin/products/${product.id}/edit`} className="flex items-center gap-3 px-5 py-3 hover:bg-stone-50">
                    <img src={product.images[0]} alt="" className="size-10 rounded-lg bg-stone-100 object-contain p-1" />
                    <p className="min-w-0 flex-1 truncate text-sm font-medium">{product.name}</p>
                    <span className={cn('text-sm font-semibold tabular-nums', product.stock === 0 ? 'text-red-600' : 'text-amber-700')}>
                      {product.stock === 0 ? 'Sold out' : `${product.stock} left`}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
