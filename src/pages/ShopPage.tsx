import { SearchX, SlidersHorizontal, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { ProductFilters } from '../components/product/ProductFilters';
import { ProductGrid } from '../components/product/ProductGrid';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { Drawer } from '../components/ui/Drawer';
import { EmptyState } from '../components/ui/EmptyState';
import { ProductGridSkeleton } from '../components/ui/Loading';
import { Pagination } from '../components/ui/Pagination';
import { collections, getCategoryName } from '../data/categories';
import { usePageTitle } from '../hooks/usePageTitle';
import { useProductFilters } from '../hooks/useProductFilters';
import { useCatalogStatus } from '../store/catalogStore';
import { sortOptions, type ProductFilters as Filters, type SortId } from '../utils/products';

function pageHeading(filters: Filters) {
  if (filters.q) return `Results for “${filters.q}”`;
  if (filters.sale) return 'Sale';
  const categoryKey = filters.categories.join(',');
  const collection = collections.find((c) => c.to === `/shop?category=${categoryKey}`);
  if (collection) return collection.name;
  if (filters.categories.length === 1) return getCategoryName(filters.categories[0]);
  if (filters.gender) return filters.gender === 'men' ? 'Men' : 'Women';
  if (filters.sort === 'newest') return 'New arrivals';
  return 'All products';
}

export function ShopPage() {
  const api = useProductFilters();
  const { filters, results, pageItems, page, pageCount, activeFilters, setSort, setPage, clearAll } = api;
  const [filtersOpen, setFiltersOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const loading = useCatalogStatus() !== 'ready';
  const heading = pageHeading(filters);
  usePageTitle(heading);

  const changePage = (next: number) => {
    setPage(next);
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const sortSelect = (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="hidden text-sm text-stone-500 sm:block">
        Sort by
      </label>
      <select
        id="sort"
        value={filters.sort}
        onChange={(e) => setSort(e.target.value as SortId)}
        className="h-10 rounded-full border border-stone-300 bg-white pr-9 pl-4 text-sm font-semibold focus:border-brand-500 focus:outline-none"
      >
        {sortOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <Container className="py-8 sm:py-12">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-brand-50 via-violet-50 to-amber-50 px-6 py-8 sm:px-10 sm:py-10">
        <span aria-hidden="true" className="absolute -top-16 -right-10 size-48 animate-blob rounded-full bg-fuchsia-200/60 blur-2xl" />
        <h1 className="relative font-display text-3xl font-semibold tracking-tight sm:text-5xl">{heading}</h1>
        <p className="relative mt-3 inline-flex rounded-full bg-white/80 px-3 py-1 text-sm font-semibold text-brand-700 shadow-sm" aria-live="polite">
          {loading ? 'Loading products…' : `${results.length} ${results.length === 1 ? 'product' : 'products'}`}
        </p>
      </div>

      <div className="grid gap-8 pt-6 lg:grid-cols-[15rem_1fr] lg:gap-10">
        <aside aria-label="Filters" className="hidden lg:block">
          <ProductFilters api={api} />
        </aside>

        <div ref={resultsRef} className="min-w-0 scroll-mt-24">
          <div className="flex items-center justify-between gap-3">
            <Button variant="secondary" size="sm" className="h-10 lg:hidden" onClick={() => setFiltersOpen(true)}>
              <SlidersHorizontal className="size-4" aria-hidden="true" />
              Filters
              {activeFilters.length > 0 && (
                <span className="bg-sunset-deep grid size-5 place-items-center rounded-full text-[11px] text-white">{activeFilters.length}</span>
              )}
            </Button>
            <div className="ml-auto">{sortSelect}</div>
          </div>

          {activeFilters.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {activeFilters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={filter.remove}
                  className="flex items-center gap-1.5 rounded-full bg-brand-50 py-1.5 pr-2.5 pl-3.5 text-sm font-medium text-brand-800 ring-1 ring-brand-100 hover:bg-brand-100"
                  aria-label={`Remove filter: ${filter.label}`}
                >
                  {filter.label}
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              ))}
              <button type="button" onClick={clearAll} className="px-2 py-1.5 text-sm font-medium text-stone-600 underline-offset-4 hover:underline">
                Clear all
              </button>
            </div>
          )}

          <div className="mt-6">
            {loading ? (
              <ProductGridSkeleton count={8} withSidebar />
            ) : pageItems.length > 0 ? (
              <>
                <ProductGrid products={pageItems} withSidebar priorityCount={4} />
                <div className="mt-12">
                  <Pagination page={page} pageCount={pageCount} onChange={changePage} />
                </div>
              </>
            ) : (
              <EmptyState
                icon={SearchX}
                title="No products found"
                description="Try removing a filter or searching for something else."
                action={<Button onClick={clearAll}>Clear all filters</Button>}
              />
            )}
          </div>
        </div>
      </div>

      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filters"
        side="left"
        maxWidthClassName="max-w-[85%] sm:max-w-sm"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={clearAll} disabled={activeFilters.length === 0}>
              Clear all
            </Button>
            <Button className="flex-1" onClick={() => setFiltersOpen(false)}>
              Show {results.length}
            </Button>
          </div>
        }
      >
        <div className="p-5">
          <ProductFilters api={api} />
        </div>
      </Drawer>
    </Container>
  );
}
