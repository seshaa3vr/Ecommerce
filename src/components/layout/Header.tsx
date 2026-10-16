import { Heart, LayoutDashboard, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { navLinks } from '../../data/categories';
import { useAuthStore } from '../../store/authStore';
import { useCartCount, useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { cn } from '../../utils/cn';
import { Container } from '../ui/Container';
import { Logo } from './Logo';
import { MobileMenu } from './MobileMenu';
import { SearchForm } from './SearchForm';

const iconButton = 'relative grid size-10 place-items-center rounded-full text-stone-700 transition-colors hover:bg-brand-50 hover:text-brand-700';

function CountBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="bg-sunset-deep absolute top-0.5 right-0.5 grid h-4.5 min-w-4.5 animate-pop place-items-center rounded-full px-1 text-[10px] leading-none font-semibold text-white" key={count}>
      {count > 99 ? '99+' : count}
    </span>
  );
}

/** A nav link is active when we're on its path and every query param it sets matches the current URL. */
function useIsActive() {
  const location = useLocation();
  const current = new URLSearchParams(location.search);
  return (to: string) => {
    const target = new URL(to, window.location.origin);
    if (target.pathname !== location.pathname) return false;
    return [...target.searchParams].every(([key, value]) => current.get(key) === value);
  };
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const cartCount = useCartCount();
  const openCart = useCartStore((s) => s.openCart);
  const wishlistCount = useWishlistStore((s) => s.ids.length);
  const user = useAuthStore((s) => s.user);
  const isActive = useIsActive();

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <Container className="flex h-16 items-center gap-2 lg:gap-8">
        <button type="button" className={cn(iconButton, '-ml-2 lg:hidden')} onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <Menu className="size-5" />
        </button>

        <Logo />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  aria-current={isActive(link.to) ? 'page' : undefined}
                  className={cn(
                    'rounded-full px-3.5 py-2 text-sm font-semibold transition-colors',
                    link.label === 'Sale'
                      ? 'bg-sunset-deep text-white shadow-md shadow-fuchsia-700/20 hover:brightness-110'
                      : isActive(link.to)
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-stone-700 hover:bg-brand-50 hover:text-brand-700',
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
          {/* Inline search where there is room: tablets (no desktop nav yet) and wide screens. */}
          <SearchForm className="mr-2 hidden w-56 md:block lg:hidden xl:block xl:w-72" />
          <button
            type="button"
            className={cn(iconButton, 'md:hidden lg:grid xl:hidden')}
            onClick={() => setSearchOpen((open) => !open)}
            aria-label={searchOpen ? 'Close search' : 'Search'}
            aria-expanded={searchOpen}
            aria-controls="mobile-search"
          >
            {searchOpen ? <X className="size-5" /> : <Search className="size-5" />}
          </button>
          {user?.role === 'admin' && (
            <Link to="/admin" className={cn(iconButton, 'hidden sm:grid')} aria-label="Admin dashboard" title="Admin dashboard">
              <LayoutDashboard className="size-5" />
            </Link>
          )}
          <Link to={user ? '/account' : '/login'} className={cn(iconButton, 'hidden sm:grid')} aria-label={user ? 'Your account' : 'Sign in'}>
            <User className="size-5" />
          </Link>
          <Link to="/wishlist" className={cn(iconButton, 'hidden sm:grid')} aria-label={`Wishlist, ${wishlistCount} items`}>
            <Heart className="size-5" />
            <CountBadge count={wishlistCount} />
          </Link>
          <button type="button" className={cn(iconButton, '-mr-2 sm:mr-0')} onClick={openCart} aria-label={`Shopping bag, ${cartCount} items`}>
            <ShoppingBag className="size-5" />
            <CountBadge count={cartCount} />
          </button>
        </div>
      </Container>

      {searchOpen && (
        <div id="mobile-search" className="border-t border-stone-200 px-4 py-3 md:hidden lg:block xl:hidden">
          <SearchForm autoFocus onSearch={() => setSearchOpen(false)} />
        </div>
      )}

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
