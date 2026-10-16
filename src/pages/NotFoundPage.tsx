import { Link } from 'react-router';
import { buttonClasses } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { usePageTitle } from '../hooks/usePageTitle';

export function NotFoundPage() {
  usePageTitle('Page not found');

  return (
    <Container className="flex flex-col items-center py-24 text-center">
      <p className="font-display text-7xl font-semibold text-brand-600 sm:text-8xl">404</p>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">We couldn't find that page</h1>
      <p className="mt-3 max-w-md text-stone-500">The link may be broken, or the product may no longer be available.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className={buttonClasses({ size: 'lg' })}>
          Go home
        </Link>
        <Link to="/shop" className={buttonClasses({ size: 'lg', variant: 'secondary' })}>
          Browse the shop
        </Link>
      </div>
    </Container>
  );
}
