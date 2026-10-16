import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { PRODUCTS_PER_PAGE } from '../config';
import { getCategoryName } from '../data/categories';
import { useProducts } from '../store/catalogStore';
import type { CategoryId } from '../types';
import {
  filterProducts,
  parseFilters,
  priceRanges,
  sortProducts,
  type GenderFilter,
  type PriceRangeId,
  type SortId,
} from '../utils/products';

export interface ActiveFilter {
  id: string;
  label: string;
  remove: () => void;
}

/** Shop filters live in the URL so results can be shared, bookmarked and navigated with Back. */
export function useProductFilters() {
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => parseFilters(params), [params]);
  const products = useProducts();

  const results = useMemo(() => sortProducts(filterProducts(products, filters), filters.sort), [products, filters]);

  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<CategoryId, number>> = {};
    for (const product of filterProducts(products, { ...filters, categories: [] })) {
      counts[product.category] = (counts[product.category] ?? 0) + 1;
    }
    return counts;
  }, [products, filters]);

  const pageCount = Math.max(1, Math.ceil(results.length / PRODUCTS_PER_PAGE));
  const page = Math.min(filters.page, pageCount);
  const pageItems = results.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE);

  /** Applies changes to the query string. Any change other than paging returns to page 1. */
  const update = useCallback(
    (changes: Record<string, string | null>) => {
      const isPaging = 'page' in changes;
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [key, value] of Object.entries(changes)) {
            if (value) next.set(key, value);
            else next.delete(key);
          }
          if (!isPaging) next.delete('page');
          return next;
        },
        { replace: !isPaging },
      );
    },
    [setParams],
  );

  const toggleCategory = (id: CategoryId) => {
    const next = filters.categories.includes(id)
      ? filters.categories.filter((c) => c !== id)
      : [...filters.categories, id];
    update({ category: next.join(',') || null });
  };
  const setGender = (gender: GenderFilter | null) => update({ gender });
  const setPrice = (price: PriceRangeId | null) => update({ price });
  const setSale = (sale: boolean) => update({ sale: sale ? '1' : null });
  const setSort = (sort: SortId) => update({ sort: sort === 'featured' ? null : sort });
  const setPage = (next: number) => update({ page: next > 1 ? String(next) : null });
  const clearAll = () => setParams(filters.sort === 'featured' ? {} : { sort: filters.sort }, { replace: true });

  const activeFilters: ActiveFilter[] = [
    ...(filters.q ? [{ id: 'q', label: `“${filters.q}”`, remove: () => update({ q: null }) }] : []),
    ...(filters.gender
      ? [{ id: 'gender', label: filters.gender === 'men' ? 'Men' : 'Women', remove: () => setGender(null) }]
      : []),
    ...filters.categories.map((id) => ({ id: `category-${id}`, label: getCategoryName(id), remove: () => toggleCategory(id) })),
    ...(filters.price
      ? [{ id: 'price', label: priceRanges.find((r) => r.id === filters.price)!.label, remove: () => setPrice(null) }]
      : []),
    ...(filters.sale ? [{ id: 'sale', label: 'On sale', remove: () => setSale(false) }] : []),
  ];

  return {
    filters,
    results,
    pageItems,
    page,
    pageCount,
    categoryCounts,
    activeFilters,
    toggleCategory,
    setGender,
    setPrice,
    setSale,
    setSort,
    setPage,
    clearAll,
  };
}

export type ProductFiltersApi = ReturnType<typeof useProductFilters>;
