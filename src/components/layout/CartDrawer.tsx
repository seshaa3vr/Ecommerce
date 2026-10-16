import { ShoppingBag } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { useCartStore } from '../../store/cartStore';
import { calculateTotals } from '../../utils/cart';
import { formatPrice } from '../../utils/format';
import { CartLineItem } from '../cart/CartLineItem';
import { FreeShippingProgress } from '../cart/FreeShippingProgress';
import { buttonClasses } from '../ui/Button';
import { Drawer } from '../ui/Drawer';
import { EmptyState } from '../ui/EmptyState';

export function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const { pathname } = useLocation();
  const totals = calculateTotals(items);

  // Close when the user navigates anywhere, e.g. via a product link inside the drawer.
  useEffect(() => {
    closeCart();
  }, [pathname, closeCart]);

  return (
    <Drawer
      open={isOpen}
      onClose={closeCart}
      title={`Your bag${totals.itemCount ? ` (${totals.itemCount})` : ''}`}
      footer={
        items.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between text-base font-semibold">
              <span>Subtotal</span>
              <span>{formatPrice(totals.subtotal)}</span>
            </div>
            <p className="text-xs text-stone-500">Shipping and taxes are calculated at checkout.</p>
            <div className="grid gap-2">
              <Link to="/checkout" onClick={closeCart} className={buttonClasses({ fullWidth: true, size: 'lg' })}>
                Checkout
              </Link>
              <Link to="/cart" onClick={closeCart} className={buttonClasses({ variant: 'secondary', fullWidth: true })}>
                View bag
              </Link>
            </div>
          </div>
        )
      }
    >
      {items.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your bag is empty"
          description="Looks like you haven't added anything yet."
          action={
            <Link to="/shop" onClick={closeCart} className={buttonClasses()}>
              Start shopping
            </Link>
          }
        />
      ) : (
        <div className="px-5 pt-4">
          <FreeShippingProgress subtotal={totals.subtotal} />
          <ul className="divide-y divide-stone-200">
            {items.map((item) => (
              <CartLineItem key={item.key} item={item} compact />
            ))}
          </ul>
        </div>
      )}
    </Drawer>
  );
}
