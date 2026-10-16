import { Heart, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { Button, buttonClasses } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { EmptyState } from '../components/ui/EmptyState';
import { PageLoader } from '../components/ui/Loading';
import { Price } from '../components/ui/Price';
import { MAX_QTY_PER_ITEM } from '../config';
import { usePageTitle } from '../hooks/usePageTitle';
import { useCartStore } from '../store/cartStore';
import { useCatalogStatus, useProducts } from '../store/catalogStore';
import { useWishlistStore } from '../store/wishlistStore';
import { cn } from '../utils/cn';
import { tintFor } from '../utils/tint';
import type { Product } from '../types';

function WishlistItem({ product }: { product: Product }) {
  const remove = useWishlistStore((s) => s.remove);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const [size, setSize] = useState('');
  const needsSize = product.sizes.length > 0;
  const soldOut = product.stock === 0;

  const moveToBag = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      image: product.images[0],
      price: product.price,
      originalPrice: product.originalPrice,
      size: needsSize ? size : undefined,
      color: product.colors[0].name,
      maxQuantity: Math.min(product.stock, MAX_QTY_PER_ITEM),
    });
    remove(product.id);
    openCart();
  };

  return (
    <li className="flex flex-col">
      <div className="relative">
        <Link to={`/product/${product.slug}`} className={cn('block aspect-square overflow-hidden rounded-3xl', tintFor(product.id))}>
          <img src={product.images[0]} alt={product.name} loading="lazy" className="size-full object-contain p-6" />
        </Link>
        <button
          type="button"
          onClick={() => remove(product.id)}
          className="absolute top-2.5 right-2.5 grid size-9 place-items-center rounded-full bg-white/90 text-stone-600 shadow-sm hover:text-stone-900"
          aria-label={`Remove ${product.name} from wishlist`}
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="mt-3 flex flex-1 flex-col gap-1">
        <p className="text-[11px] font-medium tracking-wider text-stone-500 uppercase">{product.brand}</p>
        <Link to={`/product/${product.slug}`} className="line-clamp-1 text-sm font-medium hover:underline">
          {product.name}
        </Link>
        <Price price={product.price} originalPrice={product.originalPrice} />
        <div className="mt-auto space-y-2 pt-3">
          {needsSize && !soldOut && (
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              aria-label={`Size for ${product.name}`}
              className="h-10 w-full rounded-full border border-stone-300 bg-white px-4 text-sm focus:border-stone-900 focus:outline-none"
            >
              <option value="">Select size</option>
              {product.sizes.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          )}
          <Button size="sm" fullWidth className="h-10" onClick={moveToBag} disabled={soldOut || (needsSize && !size)}>
            {soldOut ? 'Out of stock' : 'Move to bag'}
          </Button>
        </div>
      </div>
    </li>
  );
}

export function WishlistPage() {
  usePageTitle('Wishlist');
  const ids = useWishlistStore((s) => s.ids);
  const catalog = useProducts();
  const status = useCatalogStatus();
  // Products deleted by the store simply drop out of the list.
  const products = ids.map((id) => catalog.find((p) => p.id === id)).filter((p): p is Product => Boolean(p));

  if (status !== 'ready' && catalog.length === 0) return <PageLoader />;

  return (
    <Container className="py-8 sm:py-12">
      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Wishlist</h1>
      <p className="mt-2 text-sm text-stone-500">
        {products.length} saved {products.length === 1 ? 'item' : 'items'}
      </p>

      {products.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Tap the heart on any product to save it here for later."
          action={
            <Link to="/shop" className={buttonClasses({ size: 'lg' })}>
              Discover products
            </Link>
          }
        />
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-x-4 gap-y-10 min-[360px]:grid-cols-2 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <WishlistItem key={product.id} product={product} />
          ))}
        </ul>
      )}
    </Container>
  );
}
