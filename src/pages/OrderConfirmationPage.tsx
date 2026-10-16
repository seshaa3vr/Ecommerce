import { CircleCheck, PackageSearch } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { CartLineItem } from '../components/cart/CartLineItem';
import { OrderSummary } from '../components/cart/OrderSummary';
import { buttonClasses } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { EmptyState } from '../components/ui/EmptyState';
import { PageLoader } from '../components/ui/Loading';
import { OrderStatusBadge } from '../components/ui/OrderStatusBadge';
import { DELIVERY_DAYS } from '../config';
import { useApi } from '../hooks/useApi';
import { usePageTitle } from '../hooks/usePageTitle';
import type { Order } from '../types';
import { addDays, formatDate } from '../utils/format';

export function OrderConfirmationPage() {
  usePageTitle('Order details');
  const { orderId = '' } = useParams();
  const { data, loading, error } = useApi<{ order: Order }>(`/orders/${encodeURIComponent(orderId)}`);
  const order = data?.order;

  if (loading) return <PageLoader />;
  if (!order) {
    return (
      <Container className="py-12">
        <EmptyState
          icon={PackageSearch}
          title="Order not found"
          description={error ?? "We couldn't find this order on your account."}
          action={
            <Link to="/account" className={buttonClasses()}>
              View my orders
            </Link>
          }
        />
      </Container>
    );
  }

  const { shipping } = order;
  const firstName = shipping.fullName.split(' ')[0];
  const delivered = order.status === 'delivered';

  return (
    <Container className="max-w-3xl py-10 sm:py-16">
      <div className="text-center">
        <CircleCheck className="mx-auto size-14 text-emerald-600" aria-hidden="true" />
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {delivered ? 'Your order was delivered' : `Thank you, ${firstName}!`}
        </h1>
        <p className="mt-3 text-stone-600">
          Order <strong className="text-stone-900">#{order.id}</strong> {delivered ? 'has been delivered.' : 'has been placed.'} Updates go to{' '}
          {shipping.email}.
        </p>
        <div className="mt-4">
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <div className="mt-10 grid gap-4 rounded-3xl border border-stone-200 p-6 text-sm sm:grid-cols-3 sm:p-8">
        <div>
          <h2 className="font-semibold">{delivered ? 'Delivered on' : 'Estimated delivery'}</h2>
          <p className="mt-1 text-stone-600">
            {formatDate(delivered && order.deliveredAt ? order.deliveredAt : addDays(order.createdAt, DELIVERY_DAYS), {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </p>
        </div>
        <div>
          <h2 className="font-semibold">Shipping to</h2>
          <address className="mt-1 text-stone-600 not-italic">
            {shipping.fullName}
            <br />
            {shipping.address}
            <br />
            {shipping.city}, {shipping.state} {shipping.pincode}
          </address>
        </div>
        <div>
          <h2 className="font-semibold">Payment</h2>
          <p className="mt-1 text-stone-600">{order.paymentLabel}</p>
        </div>
      </div>

      <section aria-labelledby="order-items" className="mt-6 rounded-3xl bg-stone-50 p-6 sm:p-8">
        <h2 id="order-items" className="text-lg font-semibold">
          Order details
        </h2>
        <ul className="my-4 divide-y divide-stone-200 border-y border-stone-200">
          {order.items.map((item) => (
            <CartLineItem key={item.key} item={item} readOnly />
          ))}
        </ul>
        <OrderSummary totals={order.totals} />
      </section>

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Link to="/shop" className={buttonClasses({ size: 'lg' })}>
          Continue shopping
        </Link>
        <Link to="/account" className={buttonClasses({ size: 'lg', variant: 'secondary' })}>
          View my orders
        </Link>
      </div>
    </Container>
  );
}
