import { Banknote, ChevronDown, ChevronRight, RotateCcw, Truck } from 'lucide-react';
import { useRef, useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router';
import { ProductGallery } from '../components/product/ProductGallery';
import { ProductGrid } from '../components/product/ProductGrid';
import { WishlistButton } from '../components/product/WishlistButton';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { PageLoader } from '../components/ui/Loading';
import { Price } from '../components/ui/Price';
import { QuantityPicker } from '../components/ui/QuantityPicker';
import { Rating } from '../components/ui/Rating';
import { SectionHeading } from '../components/ui/SectionHeading';
import { DELIVERY_DAYS, FREE_SHIPPING_THRESHOLD, MAX_QTY_PER_ITEM } from '../config';
import { getCategoryName } from '../data/categories';
import { usePageTitle } from '../hooks/usePageTitle';
import { useCartStore } from '../store/cartStore';
import { useCatalogStatus, useProducts } from '../store/catalogStore';
import type { Product } from '../types';
import { cn } from '../utils/cn';
import { formatPrice } from '../utils/format';
import { tintFor } from '../utils/tint';
import { getProductBySlug, getRelatedProducts } from '../utils/products';
import { NotFoundPage } from './NotFoundPage';

export function ProductDetailPage() {
  const { slug } = useParams();
  const products = useProducts();
  const status = useCatalogStatus();
  const product = getProductBySlug(products, slug);
  if (!product) return status === 'idle' || status === 'loading' ? <PageLoader /> : <NotFoundPage />;
  // Keyed so size, colour and quantity reset when moving between products.
  return <ProductView key={product.id} product={product} />;
}

function Accordion({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="group border-b border-stone-200">
      <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="size-4 text-stone-500 transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="pb-5 text-sm leading-relaxed text-stone-600">{children}</div>
    </details>
  );
}

function ProductView({ product }: { product: Product }) {
  usePageTitle(product.name);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const isOneSize = product.sizes.length === 0;
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState(product.colors[0].name);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const sizeGroupRef = useRef<HTMLFieldSetElement>(null);

  const soldOut = product.stock === 0;
  const maxQuantity = Math.min(product.stock, MAX_QTY_PER_ITEM);
  const related = getRelatedProducts(useProducts(), product);

  const handleAddToBag = () => {
    if (!isOneSize && !size) {
      setSizeError(true);
      sizeGroupRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      sizeGroupRef.current?.querySelector('button')?.focus({ preventScroll: true });
      return;
    }
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        image: product.images[0],
        price: product.price,
        originalPrice: product.originalPrice,
        size: size ?? undefined,
        color,
        maxQuantity,
      },
      quantity,
    );
    setQuantity(1);
    openCart();
  };

  return (
    <>
      <Container className="py-6 sm:py-10">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-stone-500">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link to="/" className="hover:text-stone-900">
                Home
              </Link>
            </li>
            <li className="flex items-center gap-1.5">
              <ChevronRight className="size-3.5" aria-hidden="true" />
              <Link to="/shop" className="hover:text-stone-900">
                Shop
              </Link>
            </li>
            <li className="flex items-center gap-1.5">
              <ChevronRight className="size-3.5" aria-hidden="true" />
              <Link to={`/shop?category=${product.category}`} className="hover:text-stone-900">
                {getCategoryName(product.category)}
              </Link>
            </li>
            <li className="hidden min-w-0 items-center gap-1.5 text-stone-900 sm:flex" aria-current="page">
              <ChevronRight className="size-3.5 shrink-0 text-stone-500" aria-hidden="true" />
              <span className="truncate">{product.name}</span>
            </li>
          </ol>
        </nav>

        <div className="grid gap-8 md:grid-cols-2 lg:gap-14">
          <ProductGallery images={product.images} name={product.name} tint={tintFor(product.id)} />

          <div className="md:py-2">
            <p className="text-xs font-bold tracking-widest text-brand-600 uppercase">{product.brand}</p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{product.name}</h1>
            <Rating rating={product.rating} reviewCount={product.reviewCount} size="md" className="mt-3" />
            <Price price={product.price} originalPrice={product.originalPrice} size="lg" className="mt-5" />
            <p className="mt-1 text-xs text-stone-500">Taxes calculated at checkout</p>

            <p className="mt-6 text-sm leading-relaxed text-stone-600">{product.description}</p>

            <fieldset className="mt-8">
              <legend className="text-sm font-semibold">
                Colour: <span className="font-normal text-stone-600">{color}</span>
              </legend>
              <div className="mt-3 flex flex-wrap gap-3">
                {product.colors.map((option) => (
                  <button
                    key={option.name}
                    type="button"
                    onClick={() => setColor(option.name)}
                    aria-pressed={color === option.name}
                    aria-label={option.name}
                    className={cn(
                      'size-9 rounded-full ring-2 ring-offset-2 transition',
                      color === option.name ? 'ring-brand-500' : 'ring-transparent hover:ring-brand-200',
                    )}
                  >
                    <span className="block size-full rounded-full border border-black/10" style={{ backgroundColor: option.hex }} />
                  </button>
                ))}
              </div>
            </fieldset>

            {!isOneSize && (
              <fieldset ref={sizeGroupRef} className="mt-8" aria-describedby={sizeError ? 'size-error' : undefined}>
                <legend className="text-sm font-semibold">
                  Size{size && <span className="font-normal text-stone-600">: {size}</span>}
                </legend>
                <div className="mt-3 grid grid-cols-3 gap-2 min-[400px]:grid-cols-4 sm:grid-cols-6 md:grid-cols-4 xl:grid-cols-6">
                  {product.sizes.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setSize(option);
                        setSizeError(false);
                      }}
                      aria-pressed={size === option}
                      disabled={soldOut}
                      className={cn(
                        'h-11 rounded-lg border text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40',
                        size === option ? 'bg-sunset-deep border-transparent text-white shadow-md shadow-fuchsia-700/20' : 'border-stone-300 hover:border-brand-500 hover:text-brand-700',
                        sizeError && !size && 'border-red-400',
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {sizeError && (
                  <p id="size-error" className="mt-2 text-sm text-red-600" role="alert">
                    Please select a size.
                  </p>
                )}
              </fieldset>
            )}

            <div className="mt-8">
              {soldOut ? (
                <p className="text-sm font-semibold text-red-600">Out of stock</p>
              ) : product.stock <= 5 ? (
                <p className="text-sm font-semibold text-brand-700">Hurry, only {product.stock} left in stock</p>
              ) : (
                <p className="text-sm font-medium text-emerald-700">In stock, ready to ship</p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-3">
                {!soldOut && <QuantityPicker value={quantity} max={maxQuantity} onChange={setQuantity} />}
                <Button size="lg" className="h-12 flex-1" onClick={handleAddToBag} disabled={soldOut}>
                  {soldOut ? 'Sold out' : 'Add to bag'}
                </Button>
                <WishlistButton productId={product.id} productName={product.name} variant="outline" />
              </div>
            </div>

            <ul className="mt-8 grid gap-3 rounded-3xl bg-gradient-to-br from-sky-50 via-violet-50 to-pink-50 p-5 text-sm">
              <li className="flex items-center gap-3">
                <Truck className="size-5 shrink-0 text-sky-600" aria-hidden="true" />
                Free delivery on orders over {formatPrice(FREE_SHIPPING_THRESHOLD)}, usually in {DELIVERY_DAYS} days
              </li>
              <li className="flex items-center gap-3">
                <RotateCcw className="size-5 shrink-0 text-pink-600" aria-hidden="true" />
                Easy 7-day returns and exchanges
              </li>
              <li className="flex items-center gap-3">
                <Banknote className="size-5 shrink-0 text-emerald-600" aria-hidden="true" />
                Cash on delivery available
              </li>
            </ul>

            <div className="mt-6 border-t border-stone-200">
              <Accordion title="Product details" defaultOpen>
                <ul className="list-disc space-y-1 pl-5">
                  {product.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </Accordion>
              <Accordion title="Delivery & returns">
                <p>
                  Orders are dispatched within 24 hours and delivered in {DELIVERY_DAYS}–7 working days. Shipping is free on orders over{' '}
                  {formatPrice(FREE_SHIPPING_THRESHOLD)}. Unworn items with tags attached can be returned within 7 days of delivery for a
                  full refund.
                </p>
              </Accordion>
            </div>
          </div>
        </div>
      </Container>

      {related.length > 0 && (
        <section className="pt-12 sm:pt-16">
          <Container>
            <SectionHeading title="You may also like" />
            <ProductGrid products={related} />
          </Container>
        </section>
      )}
    </>
  );
}
