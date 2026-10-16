import { categories } from '../../shared/store-rules.ts';

export { categories };

export interface Collection {
  name: string;
  description: string;
  to: string;
  image: string;
  /** Tailwind gradient stops for the home page tile. */
  gradient: string;
}

// Curated entry points used by the header navigation and the home page tiles.
export const collections: Collection[] = [
  {
    name: 'Women',
    description: 'Dresses, gowns and heels',
    to: '/shop?gender=women',
    image: '/images/products/scarlet-satin-evening-gown/1.webp',
    gradient: 'from-pink-400 via-rose-400 to-orange-300',
  },
  {
    name: 'Men',
    description: 'Shirts, tees and sneakers',
    to: '/shop?gender=men',
    image: '/images/products/red-buffalo-check-flannel/1.webp',
    gradient: 'from-sky-400 via-blue-500 to-indigo-500',
  },
  {
    name: 'Footwear',
    description: 'Sneakers, pumps and sandals',
    to: '/shop?category=sneakers,heels',
    image: '/images/products/future-rider-trainers/2.webp',
    gradient: 'from-amber-300 via-orange-400 to-rose-400',
  },
  {
    name: 'Accessories',
    description: 'Bags and sunglasses',
    to: '/shop?category=bags,sunglasses',
    image: '/images/products/tan-leather-hobo-bag/1.webp',
    gradient: 'from-emerald-300 via-teal-400 to-cyan-500',
  },
];

export const navLinks = [
  { label: 'New In', to: '/shop?sort=newest' },
  ...collections.map(({ name, to }) => ({ label: name, to })),
  { label: 'Sale', to: '/shop?sale=1' },
];

export function getCategoryName(id: string) {
  return categories.find((category) => category.id === id)?.name ?? id;
}
