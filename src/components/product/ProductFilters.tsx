import { ChevronDown } from 'lucide-react';
import { useId, type ReactNode } from 'react';
import { categories } from '../../data/categories';
import type { ProductFiltersApi } from '../../hooks/useProductFilters';
import { priceRanges } from '../../utils/products';

function FilterSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details open className="group border-b border-stone-200 py-4 first:pt-0">
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="size-4 text-stone-500 transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="mt-3 space-y-1">{children}</div>
    </details>
  );
}

const optionRow = 'flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 text-sm text-stone-700 transition-colors hover:bg-brand-50 hover:text-brand-800';
const control = 'size-4 shrink-0 accent-brand-600';

export function ProductFilters({ api }: { api: ProductFiltersApi }) {
  const { filters, categoryCounts, toggleCategory, setGender, setPrice, setSale } = api;
  // The sidebar and the mobile drawer both render filters, so radio groups need unique names.
  const groupId = useId();

  return (
    <div>
      <FilterSection title="Category">
        {categories.map((category) => (
          <label key={category.id} className={optionRow}>
            <input
              type="checkbox"
              className={control}
              checked={filters.categories.includes(category.id)}
              onChange={() => toggleCategory(category.id)}
            />
            <span className="flex-1">{category.name}</span>
            <span className="text-xs text-stone-400">{categoryCounts[category.id] ?? 0}</span>
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Shop for">
        {([
          [null, 'Everyone'],
          ['women', 'Women'],
          ['men', 'Men'],
        ] as const).map(([value, label]) => (
          <label key={label} className={optionRow}>
            <input type="radio" name={`${groupId}-gender`} className={control} checked={filters.gender === value} onChange={() => setGender(value)} />
            {label}
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Price">
        <label className={optionRow}>
          <input type="radio" name={`${groupId}-price`} className={control} checked={filters.price === null} onChange={() => setPrice(null)} />
          Any price
        </label>
        {priceRanges.map((range) => (
          <label key={range.id} className={optionRow}>
            <input type="radio" name={`${groupId}-price`} className={control} checked={filters.price === range.id} onChange={() => setPrice(range.id)} />
            {range.label}
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Offers">
        <label className={optionRow}>
          <input type="checkbox" className={control} checked={filters.sale} onChange={(e) => setSale(e.target.checked)} />
          On sale
        </label>
      </FilterSection>
    </div>
  );
}
