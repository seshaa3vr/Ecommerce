import { Heart, Trash2 } from 'lucide-react';
import { Link } from 'react-router';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import type { CartItem } from '../../types';
import { cn } from '../../utils/cn';
import { formatPrice } from '../../utils/format';
import { tintFor } from '../../utils/tint';
import { QuantityPicker } from '../ui/QuantityPicker';

interface CartLineItemProps {
  item: CartItem;
  /** Compact layout for the slide-out drawer. */
  compact?: boolean;
  /** Read-only rows for checkout and order summaries. */
  readOnly?: boolean;
}

export function CartLineItem({ item, compact = false, readOnly = false }: CartLineItemProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const addToWishlist = useWishlistStore((s) => s.add);
  const options = [item.size, item.color].filter(Boolean).join(' · ');

  const saveForLater = () => {
    addToWishlist(item.productId);
    removeItem(item.key);
  };

  return (
    <li className={cn('flex gap-4', compact || readOnly ? 'py-4' : 'py-6')}>
      <Link
        to={`/product/${item.slug}`}
        className={cn('shrink-0 overflow-hidden rounded-xl', tintFor(item.productId), readOnly ? 'size-16' : compact ? 'size-20' : 'size-24 sm:size-32')}
      >
        <img src={item.image} alt={item.name} className="size-full object-contain p-2" loading="lazy" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex justify-between gap-3">
          <div className="min-w-0">
            {!readOnly && <p className="text-xs tracking-wide text-stone-500 uppercase">{item.brand}</p>}
            <Link to={`/product/${item.slug}`} className="line-clamp-2 text-sm font-medium hover:underline">
              {item.name}
            </Link>
            <p className="mt-0.5 text-xs text-stone-500">
              {options}
              {readOnly && ` · Qty ${item.quantity}`}
            </p>
          </div>
          <p className="shrink-0 text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
        </div>

        {!readOnly && (
          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
            <QuantityPicker
              size="sm"
              value={item.quantity}
              max={item.maxQuantity}
              onChange={(quantity) => updateQuantity(item.key, quantity)}
              label={`Quantity for ${item.name}`}
            />
            <div className="flex items-center">
              {!compact && (
                <button type="button" onClick={saveForLater} className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900">
                  <Heart className="size-3.5" />
                  <span className="hidden sm:inline">Save for later</span>
                  <span className="sm:hidden">Save</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => removeItem(item.key)}
                className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 hover:text-red-600"
                aria-label={`Remove ${item.name}`}
              >
                <Trash2 className="size-3.5" />
                {!compact && <span>Remove</span>}
              </button>
            </div>
          </div>
        )}
      </div>
    </li>
  );
}
