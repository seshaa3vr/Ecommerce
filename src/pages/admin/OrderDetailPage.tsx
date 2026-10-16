import { ArrowLeft, PackageSearch, RotateCcw, Trash2, Truck } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { AdminPageHeader } from '../../components/admin/AdminLayout';
import { CartLineItem } from '../../components/cart/CartLineItem';
import { OrderSummary } from '../../components/cart/OrderSummary';
import { Button, buttonClasses } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { EmptyState } from '../../components/ui/EmptyState';
import { PageLoader } from '../../components/ui/Loading';
import { OrderStatusBadge } from '../../components/ui/OrderStatusBadge';
import { useApi } from '../../hooks/useApi';
import { usePageTitle } from '../../hooks/usePageTitle';
import { api, errorMessage } from '../../lib/api';
import { useCatalogStore } from '../../store/catalogStore';
import { toast } from '../../store/toastStore';
import type { Order, OrderStatus } from '../../types';
import { formatDate } from '../../utils/format';

const dateTime = { dateStyle: 'medium', timeStyle: 'short' } as const;

export function OrderDetailPage() {
  const { id = '' } = useParams();
  usePageTitle(`Order #${id} · Admin`);
  const navigate = useNavigate();
  const reloadCatalog = useCatalogStore((s) => s.load);
  const { data, loading, error, mutate } = useApi<{ order: Order }>(`/orders/${encodeURIComponent(id)}`);
  const [busy, setBusy] = useState<'status' | 'delete' | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const order = data?.order;

  if (loading) return <PageLoader />;
  if (!order) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="Order not found"
        description={error ?? 'It may have been deleted.'}
        action={
          <Link to="/admin/orders" className={buttonClasses()}>
            Back to orders
          </Link>
        }
      />
    );
  }

  const setStatus = async (status: OrderStatus) => {
    setBusy('status');
    try {
      const { order: updated } = await api<{ order: Order }>(`/admin/orders/${order.id}`, { method: 'PATCH', body: { status } });
      mutate(() => ({ order: updated }));
      toast.success(status === 'delivered' ? 'Marked as delivered' : 'Marked as pending');
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setBusy(null);
    }
  };

  const deleteOrder = async () => {
    setBusy('delete');
    try {
      await api(`/admin/orders/${order.id}`, { method: 'DELETE' });
      if (order.status === 'pending') void reloadCatalog(); // items went back into stock
      toast.success(`Order #${order.id} deleted`);
      navigate('/admin/orders', { replace: true });
    } catch (e) {
      toast.error(errorMessage(e));
      setBusy(null);
    }
  };

  const { shipping } = order;

  return (
    <>
      <Link to="/admin/orders" className="mb-4 inline-flex items-center gap-1.5 text-sm text-stone-600 hover:text-stone-900">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Orders
      </Link>
      <AdminPageHeader
        title={`Order #${order.id}`}
        description={`Placed ${formatDate(order.createdAt, dateTime)}`}
        actions={
          <>
            {order.status === 'pending' ? (
              <Button onClick={() => setStatus('delivered')} loading={busy === 'status'}>
                {busy !== 'status' && <Truck className="size-4" aria-hidden="true" />}
                Mark as delivered
              </Button>
            ) : (
              <Button variant="secondary" onClick={() => setStatus('pending')} loading={busy === 'status'}>
                {busy !== 'status' && <RotateCcw className="size-4" aria-hidden="true" />}
                Mark as pending
              </Button>
            )}
            <Button variant="secondary" className="text-red-600 hover:border-red-600" onClick={() => setConfirmingDelete(true)}>
              <Trash2 className="size-4" aria-hidden="true" />
              Delete
            </Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
        <section aria-labelledby="items-heading" className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 id="items-heading" className="font-semibold">
              Items
            </h2>
            <OrderStatusBadge status={order.status} audience="admin" />
          </div>
          <ul className="my-4 divide-y divide-stone-100 border-y border-stone-100">
            {order.items.map((item) => (
              <CartLineItem key={item.key} item={item} readOnly />
            ))}
          </ul>
          <OrderSummary totals={order.totals} />
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl border border-stone-200 bg-white p-5 text-sm sm:p-6">
            <h2 className="font-semibold">Customer</h2>
            <p className="mt-3 font-medium">{shipping.fullName}</p>
            <p className="text-stone-600">
              <a href={`mailto:${shipping.email}`} className="hover:underline">
                {shipping.email}
              </a>
            </p>
            <p className="text-stone-600">
              <a href={`tel:${shipping.phone.replace(/\s/g, '')}`} className="hover:underline">
                {shipping.phone}
              </a>
            </p>
            {shipping.email !== order.userEmail && <p className="mt-1 text-xs text-stone-500">Account: {order.userEmail}</p>}

            <h2 className="mt-6 font-semibold">Shipping address</h2>
            <address className="mt-2 text-stone-600 not-italic">
              {shipping.address}
              <br />
              {shipping.city}, {shipping.state} {shipping.pincode}
            </address>

            <h2 className="mt-6 font-semibold">Payment</h2>
            <p className="mt-2 text-stone-600">{order.paymentLabel}</p>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-5 text-sm sm:p-6">
            <h2 className="font-semibold">Timeline</h2>
            <ol className="mt-3 space-y-3 border-l-2 border-stone-200 pl-4">
              <li>
                <p className="font-medium">Order placed</p>
                <p className="text-stone-500">{formatDate(order.createdAt, dateTime)}</p>
              </li>
              <li>
                <p className="font-medium">{order.deliveredAt ? 'Delivered' : 'Awaiting delivery'}</p>
                {order.deliveredAt && <p className="text-stone-500">{formatDate(order.deliveredAt, dateTime)}</p>}
              </li>
            </ol>
          </section>
        </div>
      </div>

      <ConfirmDialog
        open={confirmingDelete}
        title={`Delete order #${order.id}?`}
        description={
          order.status === 'pending'
            ? 'The order will be removed and its items put back into stock. This cannot be undone.'
            : 'The order record will be removed permanently. Stock is not changed because it was already delivered.'
        }
        confirmLabel="Delete order"
        loading={busy === 'delete'}
        onConfirm={deleteOrder}
        onCancel={() => setConfirmingDelete(false)}
      />
    </>
  );
}
