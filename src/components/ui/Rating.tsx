import { Star } from 'lucide-react';
import { cn } from '../../utils/cn';

interface RatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export function Rating({ rating, reviewCount, size = 'sm', className }: RatingProps) {
  const starSize = size === 'sm' ? 'size-3.5' : 'size-4.5';

  if (reviewCount === 0) {
    return <p className={cn('text-stone-500', size === 'sm' ? 'text-xs' : 'text-sm', className)}>No reviews yet</p>;
  }

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex" role="img" aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, rating - i));
          return (
            <span key={i} className="relative inline-flex" aria-hidden="true">
              <Star className={cn(starSize, 'text-stone-300')} fill="currentColor" strokeWidth={0} />
              <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className={cn(starSize, 'max-w-none text-amber-400')} fill="currentColor" strokeWidth={0} />
              </span>
            </span>
          );
        })}
      </div>
      {reviewCount !== undefined && (
        <span className={cn('text-stone-500', size === 'sm' ? 'text-xs' : 'text-sm')}>
          {rating.toFixed(1)} ({reviewCount.toLocaleString('en-IN')})
        </span>
      )}
    </div>
  );
}
