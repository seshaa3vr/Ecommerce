import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import type { Product } from '../../types';
import { discountPercent } from '../../utils/format';
import { tintFor } from '../../utils/tint';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';
import { Price } from '../ui/Price';
import { Rating } from '../ui/Rating';
import { WishlistButton } from './WishlistButton';

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  // Only fetch the alternate photo once a mouse hovers the card, so phones never download it.
  const [showAlternate, setShowAlternate] = useState(false);
  const discount = discountPercent(product.price, product.originalPrice);
  const soldOut = product.stock === 0;

  return (
    <article className="group relative transition-transform duration-300 hover:-translate-y-1.5" onPointerEnter={(e) => e.pointerType === 'mouse' && setShowAlternate(true)}>
      <Link to={`/product/${product.slug}`} className="block rounded-2xl">
        <div className={cn('relative aspect-square overflow-hidden rounded-3xl transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-fuchsia-900/10', tintFor(product.id))}>
          <img
            src={product.images[0]}
            alt={product.name}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            width={800}
            height={800}
            className="absolute inset-0 size-full object-contain p-5 drop-shadow-lg transition duration-500 group-hover:scale-110 group-hover:-rotate-2 sm:p-7"
          />
          {showAlternate && product.images[1] && (
            <img
              src={product.images[1]}
              alt=""
              aria-hidden="true"
              decoding="async"
              className={cn('absolute inset-0 size-full object-contain p-5 opacity-0 drop-shadow-lg transition duration-500 group-hover:scale-105 group-hover:opacity-100 sm:p-7', tintFor(product.id))}
            />
          )}
          <span
            aria-hidden="true"
            className="absolute right-3 bottom-3 hidden translate-y-3 items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-stone-900 opacity-0 shadow-md transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:flex"
          >
            View <ArrowUpRight className="size-3.5" />
          </span>
          <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
            {soldOut ? (
              <Badge tone="muted">Sold out</Badge>
            ) : (
              <>
                {discount > 0 && <Badge tone="sale">−{discount}%</Badge>}
                {product.isNew && <Badge tone="new">New</Badge>}
              </>
            )}
          </div>
        </div>

        <div className="mt-3 space-y-1 px-0.5">
          <p className="text-[11px] font-medium tracking-wider text-stone-500 uppercase">{product.brand}</p>
          <h3 className="line-clamp-1 text-sm font-semibold text-stone-900 transition-colors group-hover:text-brand-700">{product.name}</h3>
          <Rating rating={product.rating} reviewCount={product.reviewCount} />
          <Price price={product.price} originalPrice={product.originalPrice} />
        </div>
      </Link>
      <WishlistButton productId={product.id} productName={product.name} className="absolute top-2.5 right-2.5" />
    </article>
  );
}
