import { ChevronRight, Heart, LayoutDashboard, Package, ShoppingBag, User, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router';
import { STORE_NAME } from '../../config';
import { navLinks } from '../../data/categories';
import { useAuthStore } from '../../store/authStore';
import { useCartCount } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { cn } from '../../utils/cn';
import { Drawer } from '../ui/Drawer';

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const user = useAuthStore((s) => s.user);
  const cartCount = useCartCount();
  const wishlistCount = useWishlistStore((s) => s.ids.length);

  const accountLinks: { label: string; to: string; icon: LucideIcon; count?: number }[] = [
    { label: user ? 'My account' : 'Sign in / Register', to: user ? '/account' : '/login', icon: User },
    { label: 'Wishlist', to: '/wishlist', icon: Heart, count: wishlistCount },
    { label: 'Shopping bag', to: '/cart', icon: ShoppingBag, count: cartCount },
    ...(user ? [{ label: 'My orders', to: '/account', icon: Package }] : []),
    ...(user?.role === 'admin' ? [{ label: 'Admin dashboard', to: '/admin', icon: LayoutDashboard }] : []),
  ];

  return (
    <Drawer open={open} onClose={onClose} side="left" title={STORE_NAME} maxWidthClassName="max-w-[85%] sm:max-w-sm">
      <nav aria-label="Mobile" className="px-3 py-4">
        <ul>
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                to={link.to}
                onClick={onClose}
                className={cn(
                  'flex items-center justify-between rounded-lg px-3 py-3.5 text-base font-medium hover:bg-stone-100',
                  link.label === 'Sale' && 'text-brand-600',
                )}
              >
                {link.label}
                <ChevronRight className="size-4 text-stone-400" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>

        <ul className="mt-4 border-t border-stone-200 pt-4">
          {accountLinks.map(({ label, to, icon: Icon, count }) => (
            <li key={label}>
              <Link to={to} onClick={onClose} className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-stone-700 hover:bg-stone-100">
                <Icon className="size-5 text-stone-500" aria-hidden="true" />
                <span className="flex-1">{label}</span>
                {!!count && <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-semibold">{count}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Drawer>
  );
}
