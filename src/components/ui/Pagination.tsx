import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface PaginationProps {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}

/** Page numbers with ellipses, e.g. 1 … 4 5 6 … 12. */
function pageList(page: number, pageCount: number): Array<number | 'gap'> {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const pages = new Set([1, pageCount, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= pageCount).sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? ['gap' as const, p] : [p]));
}

export function Pagination({ page, pageCount, onChange }: PaginationProps) {
  if (pageCount <= 1) return null;
  const arrow = 'grid size-10 place-items-center rounded-full text-stone-700 hover:bg-stone-100 disabled:pointer-events-none disabled:opacity-40';

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
      <button type="button" className={arrow} onClick={() => onChange(page - 1)} disabled={page === 1} aria-label="Previous page">
        <ChevronLeft className="size-5" />
      </button>
      {pageList(page, pageCount).map((p, i) =>
        p === 'gap' ? (
          <span key={`gap-${i}`} className="px-1 text-stone-400">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={cn(
              'size-10 rounded-full text-sm font-medium transition-colors',
              p === page ? 'bg-sunset-deep text-white shadow-md shadow-fuchsia-700/20' : 'text-stone-700 hover:bg-brand-50 hover:text-brand-700',
            )}
          >
            {p}
          </button>
        ),
      )}
      <button type="button" className={arrow} onClick={() => onChange(page + 1)} disabled={page === pageCount} aria-label="Next page">
        <ChevronRight className="size-5" />
      </button>
    </nav>
  );
}
