import { Heart } from 'lucide-react';
import { useState } from 'react';
import { useWishlistStore } from '../../store/wishlistStore';
import { cn } from '../../utils/cn';

interface WishlistButtonProps {
  productId: number;
  productName: string;
  className?: string;
  /** "icon" floats over product images; "outline" sits beside the add-to-bag button. */
  variant?: 'icon' | 'outline';
}

export function WishlistButton({ productId, productName, className, variant = 'icon' }: WishlistButtonProps) {
  const saved = useWishlistStore((s) => s.ids.includes(productId));
  const toggle = useWishlistStore((s) => s.toggle);
  const [popping, setPopping] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        if (!saved) setPopping(true);
        toggle(productId);
      }}
      onAnimationEnd={() => setPopping(false)}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${productName} from wishlist` : `Save ${productName} to wishlist`}
      className={cn(
        'grid shrink-0 place-items-center rounded-full transition duration-200',
        variant === 'icon'
          ? 'size-9 bg-white/90 text-stone-700 shadow-sm backdrop-blur hover:scale-110 hover:bg-white hover:text-brand-600'
          : 'size-12 border border-stone-300 text-stone-700 hover:border-brand-500 hover:text-brand-600',
        saved && 'text-brand-600',
        popping && 'animate-pop',
        className,
      )}
    >
      <Heart className={variant === 'icon' ? 'size-4.5' : 'size-5'} fill={saved ? 'currentColor' : 'none'} />
    </button>
  );
}
