import { ChevronRight, LayoutDashboard, LogOut, Package } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button, buttonClasses } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { EmptyState } from '../components/ui/EmptyState';
import { PageLoader } from '../components/ui/Loading';
import { OrderStatusBadge } from '../components/ui/OrderStatusBadge';
import { useApi } from '../hooks/useApi';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAuthStore } from '../store/authStore';
import type { Order } from '../types';
import { formatDate, formatPrice } from '../utils/format';

export function AccountPage() {
  usePageTitle('My account');
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user)!;
  const logout = useAuthStore((s) => s.logout);
  const { data, loading, error, reload } = useApi<{ orders: Order[] }>('/orders');
  const orders = data?.orders ?? [];

  // Sign out only after leaving this protected page. Signing out first would re-render the
  // RequireAuth guard before the navigation lands and bounce the visitor to /login instead of home.
  const signingOut = useRef(false);
  useEffect(
    () => () => {
      if (signingOut.current) void logout();
    },
    [logout],
  );

  const handleLogout = () => {
    signingOut.current = true;
    navigate('/');
  };

  return (
    <Container className="max-w-4xl py-8 sm:py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Hi, {user.name.split(' ')[0]}</h1>
          <p className="mt-1 text-sm text-stone-500">{user.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {user.role === 'admin' && (
            <Link to="/admin" className={buttonClasses()}>
              <LayoutDashboard className="size-4" aria-hidden="true" />
              Admin dashboard
            </Link>
          )}
          <Button variant="secondary" onClick={handleLogout}>
            <LogOut className="size-4" aria-hidden="true" />
            Sign out
          </Button>
        </div>
      </div>

      <section aria-labelledby="orders-heading" className="mt-10">
        <h2 id="orders-heading" className="text-xl font-semibold">
          Your orders
        </h2>

        {loading ? (
          <PageLoader className="min-h-48" />
        ) : error ? (
          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl bg-red-50 p-4 text-sm text-red-800" role="alert">
            {error}
            <Button size="sm" variant="secondary" onClick={reload}>
              Try again
            </Button>
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="When you place an order, it will show up here."
            action={
              <Link to="/shop" className={buttonClasses()}>
                Start shopping
              </Link>
            }
          />
        ) : (
          <ul className="mt-5 space-y-4">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  to={`/order/${order.id}`}
                  className="flex flex-col gap-4 rounded-2xl border border-stone-200 p-5 transition-colors hover:border-stone-400 sm:flex-row sm:items-center"
                >
                  <div className="flex -space-x-3">
                    {order.items.slice(0, 3).map((item) => (
                      <img key={item.key} src={item.image} alt="" className="size-14 rounded-xl border-2 border-white bg-stone-100 object-contain p-1" />
                    ))}
                  </div>
                  <div className="flex-1">
                    <p className="flex flex-wrap items-center gap-2 font-semibold">
                      #{order.id}
                      <OrderStatusBadge status={order.status} />
                    </p>
                    <p className="mt-1 text-sm text-stone-500">
                      {formatDate(order.createdAt)} · {order.totals.itemCount} {order.totals.itemCount === 1 ? 'item' : 'items'} ·{' '}
                      {formatPrice(order.totals.total)}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 text-sm font-medium">
                    View details
                    <ChevronRight className="size-4" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </Container>
  );
}
