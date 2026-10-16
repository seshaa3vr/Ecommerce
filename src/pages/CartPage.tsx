import { Lock, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router';
import { CartLineItem } from '../components/cart/CartLineItem';
import { FreeShippingProgress } from '../components/cart/FreeShippingProgress';
import { OrderSummary } from '../components/cart/OrderSummary';
import { buttonClasses } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { EmptyState } from '../components/ui/EmptyState';
import { usePageTitle } from '../hooks/usePageTitle';
import { useCartStore } from '../store/cartStore';
import { calculateTotals } from '../utils/cart';

export function CartPage() {
  usePageTitle('Shopping bag');
  const items = useCartStore((s) => s.items);
  const totals = calculateTotals(items);

  if (items.length === 0) {
    return (
      <Container className="py-12">
        <EmptyState
          icon={ShoppingBag}
          title="Your bag is empty"
          description="Browse our latest collections and find something you love."
          action={
            <Link to="/shop" className={buttonClasses({ size: 'lg' })}>
              Start shopping
            </Link>
          }
        />
      </Container>
    );
  }

  return (
    <Container className="py-8 sm:py-12">
      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Shopping bag</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_24rem] lg:items-start">
        <section aria-label="Items in your bag">
          <FreeShippingProgress subtotal={totals.subtotal} />
          <ul className="divide-y divide-stone-200 border-b border-stone-200">
            {items.map((item) => (
              <CartLineItem key={item.key} item={item} />
            ))}
          </ul>
        </section>

        <section aria-labelledby="summary-heading" className="rounded-[2rem] bg-gradient-to-br from-brand-50 via-white to-violet-50 p-6 ring-1 ring-brand-100 lg:sticky lg:top-24">
          <h2 id="summary-heading" className="mb-5 text-lg font-semibold">
            Order summary
          </h2>
          <OrderSummary totals={totals}>
            <Link to="/checkout" className={`mt-6 ${buttonClasses({ size: 'lg', fullWidth: true })}`}>
              <Lock className="size-4" aria-hidden="true" />
              Checkout securely
            </Link>
            <Link to="/shop" className={`mt-3 ${buttonClasses({ variant: 'ghost', fullWidth: true })}`}>
              Continue shopping
            </Link>
          </OrderSummary>
        </section>
      </div>
    </Container>
  );
}
