import type { Product } from '../../types';
import { cn } from '../../utils/cn';
import { Reveal } from '../ui/Reveal';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  /** Shop page leaves room for the filter sidebar, so it only reaches 4 columns on wide screens. */
  withSidebar?: boolean;
  /** Load the first row eagerly when the grid is near the top of the page. */
  priorityCount?: number;
}

export function ProductGrid({ products, withSidebar = false, priorityCount = 0 }: ProductGridProps) {
  return (
    <ul
      role="list"
      className={cn(
        'grid grid-cols-1 gap-x-4 gap-y-8 min-[360px]:grid-cols-2 sm:gap-x-6 md:grid-cols-3',
        withSidebar ? 'xl:grid-cols-4' : 'lg:grid-cols-4',
      )}
    >
      {products.map((product, index) => (
        <li key={product.id}>
          <Reveal delay={(index % 4) * 90}>
            <ProductCard product={product} priority={index < priorityCount} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
