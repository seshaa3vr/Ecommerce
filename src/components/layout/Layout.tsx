import { CircleAlert, Sparkles } from 'lucide-react';
import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { DELIVERY_DAYS, FREE_SHIPPING_THRESHOLD } from '../../config';
import { useCatalogStore } from '../../store/catalogStore';
import { formatPrice } from '../../utils/format';
import { Button } from '../ui/Button';
import { PageLoader } from '../ui/Loading';
import { CartDrawer } from './CartDrawer';
import { Footer } from './Footer';
import { Header } from './Header';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function CatalogErrorBanner() {
  const status = useCatalogStore((s) => s.status);
  const error = useCatalogStore((s) => s.error);
  const load = useCatalogStore((s) => s.load);
  if (status !== 'error') return null;
  return (
    <div role="alert" className="flex flex-wrap items-center justify-center gap-3 bg-red-50 px-4 py-3 text-sm text-red-800">
      <CircleAlert className="size-4" aria-hidden="true" />
      {error ?? 'We could not load products.'}
      <Button size="sm" variant="secondary" onClick={() => void load()}>
        Try again
      </Button>
    </div>
  );
}

const offers = [
  `Free shipping on orders over ${formatPrice(FREE_SHIPPING_THRESHOLD)}`,
  'Easy 7-day returns',
  'New arrivals every week',
  'Cash on delivery available',
  `Delivered in ${DELIVERY_DAYS} days across India`,
];

/** Scrolling offers strip. The text is repeated for a seamless loop; screen readers get it once. */
function OffersMarquee() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {offers.map((offer) => (
        <li key={offer} className="flex items-center gap-3 px-6 text-xs font-semibold whitespace-nowrap">
          <Sparkles className="size-3.5 text-amber-200" aria-hidden="true" />
          {offer}
        </li>
      ))}
    </ul>
  );
  return (
    <div className="bg-sunset-deep overflow-hidden py-2 text-white">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

export function Layout() {
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-stone-900 focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <OffersMarquee />
      <Header />
      <main id="main" className="flex-1">
        <CatalogErrorBanner />
        <Suspense fallback={<PageLoader />}>
          {/* Keyed by path so each new page fades in. */}
          <div key={pathname} className="animate-fade-in">
            <Outlet />
          </div>
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
      <ScrollToTop />
    </div>
  );
}
