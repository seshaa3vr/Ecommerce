import { LoaderCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

export function PageLoader({ className }: { className?: string }) {
  return (
    <div className={cn('grid min-h-[50vh] place-items-center', className)} role="status" aria-label="Loading">
      <LoaderCircle className="size-8 animate-spin text-stone-400" />
    </div>
  );
}

/** Placeholder cards shown while the catalog loads, matching the real grid's layout. */
export function ProductGridSkeleton({ count = 4, withSidebar = false }: { count?: number; withSidebar?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'grid grid-cols-1 gap-x-4 gap-y-8 min-[360px]:grid-cols-2 sm:gap-x-6 md:grid-cols-3',
        withSidebar ? 'xl:grid-cols-4' : 'lg:grid-cols-4',
      )}
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-square rounded-2xl bg-stone-100" />
          <div className="mt-3 h-3 w-1/3 rounded bg-stone-100" />
          <div className="mt-2 h-4 w-3/4 rounded bg-stone-100" />
          <div className="mt-2 h-4 w-1/4 rounded bg-stone-100" />
        </div>
      ))}
    </div>
  );
}
