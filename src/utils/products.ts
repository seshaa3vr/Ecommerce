import { categories, getCategoryName } from '../data/categories';
import type { CategoryId, Product } from '../types';
import { discountPercent, formatPrice } from './format';

export const sortOptions = [
  { id: 'featured', label: 'Featured' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Top Rated' },
] as const;

export type SortId = (typeof sortOptions)[number]['id'];

export const priceRanges = [
  { id: 'under-1000', label: `Under ${formatPrice(1000)}`, min: 0, max: 999 },
  { id: '1000-2500', label: `${formatPrice(1000)} – ${formatPrice(2500)}`, min: 1000, max: 2500 },
  { id: '2500-5000', label: `${formatPrice(2500)} – ${formatPrice(5000)}`, min: 2500, max: 5000 },
  { id: '5000-plus', label: `Over ${formatPrice(5000)}`, min: 5000, max: Infinity },
] as const;

export type PriceRangeId = (typeof priceRanges)[number]['id'];

export type GenderFilter = 'men' | 'women';

export interface ProductFilters {
  q: string;
  categories: CategoryId[];
  gender: GenderFilter | null;
  price: PriceRangeId | null;
  sale: boolean;
  sort: SortId;
  page: number;
}

const categoryIds = new Set<string>(categories.map((category) => category.id));
const sortIds = new Set<string>(sortOptions.map((option) => option.id));
const priceIds = new Set<string>(priceRanges.map((range) => range.id));

export function parseFilters(params: URLSearchParams): ProductFilters {
  const gender = params.get('gender');
  const price = params.get('price');
  const sort = params.get('sort');
  const page = Number.parseInt(params.get('page') ?? '1', 10);

  return {
    q: params.get('q')?.trim() ?? '',
    categories: (params.get('category') ?? '')
      .split(',')
      .filter((id): id is CategoryId => categoryIds.has(id)),
    gender: gender === 'men' || gender === 'women' ? gender : null,
    price: price && priceIds.has(price) ? (price as PriceRangeId) : null,
    sale: params.get('sale') === '1',
    sort: sort && sortIds.has(sort) ? (sort as SortId) : 'featured',
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

function matchesSearch(product: Product, query: string) {
  const haystack = [product.name, product.brand, getCategoryName(product.category), product.gender, ...product.colors.map((c) => c.name)]
    .join(' ')
    .toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .every((term) => haystack.includes(term));
}

export function filterProducts(list: Product[], filters: Omit<ProductFilters, 'sort' | 'page'>) {
  const range = priceRanges.find((r) => r.id === filters.price);
  return list.filter((product) => {
    if (filters.q && !matchesSearch(product, filters.q)) return false;
    if (filters.categories.length && !filters.categories.includes(product.category)) return false;
    if (filters.gender && product.gender !== filters.gender && product.gender !== 'unisex') return false;
    if (range && (product.price < range.min || product.price > range.max)) return false;
    if (filters.sale && !product.originalPrice) return false;
    return true;
  });
}

export function sortProducts(list: Product[], sort: SortId) {
  const sorted = [...list];
  switch (sort) {
    case 'newest':
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    default:
      return sorted;
  }
}

export function getProductBySlug(products: Product[], slug: string | undefined) {
  return products.find((product) => product.slug === slug);
}

/** Same category first, then the same audience, excluding the product itself. */
export function getRelatedProducts(products: Product[], product: Product, limit = 4) {
  const others = products.filter((p) => p.id !== product.id);
  const sameCategory = others.filter((p) => p.category === product.category);
  const sameGender = others.filter((p) => p.category !== product.category && p.gender === product.gender);
  return [...sameCategory, ...sameGender].slice(0, limit);
}

export function getBestsellers(products: Product[], limit = 4) {
  return products
    .filter((p) => p.isBestseller)
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, limit);
}

export function getNewArrivals(products: Product[], limit = 4) {
  return sortProducts(
    products.filter((p) => p.isNew),
    'newest',
  ).slice(0, limit);
}

export function maxDiscountPercent(products: Product[]) {
  return Math.max(0, ...products.map((p) => discountPercent(p.price, p.originalPrice)));
}
