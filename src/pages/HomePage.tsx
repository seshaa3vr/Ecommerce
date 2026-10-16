import { ArrowRight, Banknote, RotateCcw, ShieldCheck, Sparkles, Star, Truck } from 'lucide-react';
import { useState, type CSSProperties, type FormEvent } from 'react';
import { Link } from 'react-router';
import { ProductGrid } from '../components/product/ProductGrid';
import { Button, buttonClasses } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { ProductGridSkeleton } from '../components/ui/Loading';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeading } from '../components/ui/SectionHeading';
import { FREE_SHIPPING_THRESHOLD } from '../config';
import { categories, collections } from '../data/categories';
import { usePageTitle } from '../hooks/usePageTitle';
import { useCatalogStatus, useProducts } from '../store/catalogStore';
import { cn } from '../utils/cn';
import { formatPrice } from '../utils/format';
import { getBestsellers, getNewArrivals, maxDiscountPercent } from '../utils/products';

// Photos used as artwork in the hero and sale banner.
const HERO_ART = {
  main: '/images/products/floral-print-maxi-gown/1.webp',
  bag: '/images/products/tan-leather-hobo-bag/1.webp',
  shoes: '/images/products/future-rider-trainers/2.webp',
  sale: '/images/products/air-jordan-1-high-red-and-black/2.webp',
};

const perks = [
  { icon: Truck, title: 'Free shipping', text: `Over ${formatPrice(FREE_SHIPPING_THRESHOLD)}`, color: 'bg-sky-100 text-sky-700' },
  { icon: RotateCcw, title: 'Easy returns', text: '7 days, no fuss', color: 'bg-pink-100 text-pink-700' },
  { icon: ShieldCheck, title: 'Secure payments', text: 'Cards & UPI', color: 'bg-violet-100 text-violet-700' },
  { icon: Banknote, title: 'Cash on delivery', text: 'Pay at your door', color: 'bg-emerald-100 text-emerald-700' },
];

const tilt = (deg: number, delay = 0): CSSProperties => ({ '--tilt': `${deg}deg`, animationDelay: `${delay}s` }) as CSSProperties;

function HeroCollage({ discount, topRated }: { discount: number; topRated?: { name: string; rating: number; image: string } }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md md:max-w-lg" aria-hidden="true">
      <div className="absolute top-[6%] left-0 w-[54%] animate-float" style={tilt(-4)}>
        <div className="aspect-[3/4] rounded-[2rem] bg-gradient-to-b from-pink-200 to-rose-100 p-4 shadow-2xl shadow-pink-900/15 ring-4 ring-white">
          <img src={HERO_ART.main} alt="" fetchPriority="high" className="size-full object-contain drop-shadow-xl" />
        </div>
      </div>
      <div className="absolute top-0 right-0 w-[44%] animate-float" style={tilt(5, -2)}>
        <div className="aspect-square rounded-[2rem] bg-gradient-to-br from-amber-200 to-orange-100 p-4 shadow-2xl shadow-orange-900/15 ring-4 ring-white">
          <img src={HERO_ART.bag} alt="" className="size-full object-contain drop-shadow-xl" />
        </div>
      </div>
      <div className="absolute right-[2%] bottom-[4%] w-[48%] animate-float" style={tilt(-3, -4)}>
        <div className="aspect-square rounded-[2rem] bg-gradient-to-br from-violet-200 to-sky-100 p-4 shadow-2xl shadow-violet-900/15 ring-4 ring-white">
          <img src={HERO_ART.shoes} alt="" className="size-full object-contain drop-shadow-xl" />
        </div>
      </div>
      {discount > 0 && (
        <div className="bg-sunset-deep absolute top-[44%] left-[44%] grid size-24 animate-float place-items-center rounded-full text-center text-white shadow-xl ring-4 ring-white sm:size-28" style={tilt(12, -1)}>
          <p className="leading-none">
            <span className="block text-[10px] font-bold tracking-widest uppercase">Up to</span>
            <span className="block font-display text-3xl font-semibold sm:text-4xl">{discount}%</span>
            <span className="block text-[10px] font-bold tracking-widest uppercase">off</span>
          </p>
        </div>
      )}
      {topRated && (
        <div className="absolute bottom-[10%] left-0 flex animate-float items-center gap-3 rounded-2xl bg-white/95 p-2.5 pr-4 shadow-xl backdrop-blur" style={tilt(0, -3)}>
          <img src={topRated.image} alt="" className="size-11 rounded-xl bg-violet-50 object-contain p-1" />
          <div>
            <p className="flex items-center gap-1 text-sm font-bold">
              <Star className="size-3.5 fill-amber-400 text-amber-400" /> {topRated.rating.toFixed(1)}
            </p>
            <p className="max-w-32 truncate text-xs text-stone-500">{topRated.name}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Hero() {
  const products = useProducts();
  const reviewed = products.filter((p) => p.reviewCount > 0);
  const averageRating = reviewed.length ? reviewed.reduce((sum, p) => sum + p.rating, 0) / reviewed.length : 0;
  const top = [...reviewed].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)[0];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-violet-50 to-amber-50">
      {/* Soft colour blobs drifting behind the content */}
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 -left-32 size-[26rem] animate-blob rounded-full bg-fuchsia-300/40 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute top-10 -right-32 size-[30rem] animate-blob rounded-full bg-amber-200/60 blur-3xl [animation-delay:-5s]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 left-1/3 size-[26rem] animate-blob rounded-full bg-violet-300/40 blur-3xl [animation-delay:-9s]" />

      <Container className="relative grid items-center gap-12 pt-12 pb-24 md:grid-cols-2 md:pt-16 lg:pt-20 lg:pb-32">
        <div className="max-w-xl animate-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-sm font-semibold text-brand-700 shadow-sm ring-1 ring-brand-100 backdrop-blur">
            <Sparkles className="size-4" aria-hidden="true" />
            New season · Autumn 2026
          </p>
          <h1 className="mt-6 font-display text-5xl leading-[1.02] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Wear what feels <span className="text-sunset animate-gradient">like you.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-stone-600">
            Bold prints, easy shirts and statement shoes, picked for everyday confidence and delivered to your door.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop?gender=women" className={buttonClasses({ size: 'lg' })}>
              Shop women
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link to="/shop?gender=men" className={buttonClasses({ size: 'lg', variant: 'secondary' })}>
              Shop men
            </Link>
          </div>
          {products.length > 0 && (
            <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
              <div>
                <dt className="text-xs font-semibold tracking-wide text-stone-500 uppercase">Styles</dt>
                <dd className="font-display text-2xl font-semibold">{products.length}+</dd>
              </div>
              {averageRating > 0 && (
                <div>
                  <dt className="text-xs font-semibold tracking-wide text-stone-500 uppercase">Avg. rating</dt>
                  <dd className="flex items-center gap-1 font-display text-2xl font-semibold">
                    {averageRating.toFixed(1)} <Star className="size-5 fill-amber-400 text-amber-400" aria-hidden="true" />
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-xs font-semibold tracking-wide text-stone-500 uppercase">Categories</dt>
                <dd className="font-display text-2xl font-semibold">{categories.length}</dd>
              </div>
            </dl>
          )}
        </div>

        <HeroCollage
          discount={maxDiscountPercent(products)}
          topRated={top && { name: top.name, rating: top.rating, image: top.images[0] }}
        />
      </Container>
    </section>
  );
}

function Perks() {
  return (
    <section aria-label="Why shop with us" className="relative z-10 -mt-12">
      <Container>
        <div className="grid grid-cols-2 gap-3 rounded-3xl bg-white p-4 shadow-xl shadow-violet-900/5 ring-1 ring-stone-100 sm:gap-4 sm:p-6 lg:grid-cols-4">
          {perks.map(({ icon: Icon, title, text, color }) => (
            <div key={title} className="flex items-center gap-3">
              <div className={cn('grid size-11 shrink-0 place-items-center rounded-2xl', color)}>
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold">{title}</p>
                <p className="text-xs text-stone-500">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function Collections() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <SectionHeading eyebrow="Explore" title="Shop by collection" subtitle="Find your next favourite piece." />
        <ul className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {collections.map((collection, index) => (
            <li key={collection.name}>
              <Reveal delay={index * 100} className="h-full">
                <Link
                  to={collection.to}
                  className={cn(
                    'group relative flex aspect-[4/5] h-full flex-col overflow-hidden rounded-[2rem] bg-gradient-to-br p-3 shadow-lg transition duration-500 hover:-translate-y-2 hover:shadow-2xl sm:p-5',
                    collection.gradient,
                  )}
                >
                  <span aria-hidden="true" className="absolute -top-10 -right-10 size-40 rounded-full bg-white/20" />
                  <span aria-hidden="true" className="absolute bottom-20 -left-8 size-24 rounded-full bg-white/15" />
                  <img
                    src={collection.image}
                    alt=""
                    loading="lazy"
                    className="relative min-h-0 flex-1 object-contain drop-shadow-2xl transition duration-500 group-hover:scale-110 group-hover:-rotate-3"
                  />
                  <div className="relative mt-3 flex items-center justify-between gap-2 rounded-2xl bg-white/95 px-3 py-2.5 shadow-md sm:px-4 sm:py-3">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold sm:text-base">{collection.name}</h3>
                      <p className="hidden truncate text-xs text-stone-600 sm:block">{collection.description}</p>
                    </div>
                    <span className="bg-sunset-deep grid size-8 shrink-0 place-items-center rounded-full text-white transition-transform group-hover:translate-x-1">
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/** A tilted, scrolling ribbon of category names. Purely decorative. */
function CategoryRibbon() {
  const words = categories.map((c) => c.name);
  const row = (
    <div className="flex shrink-0 items-center">
      {words.map((word) => (
        <span key={word} className="flex items-center gap-6 px-6 font-display text-2xl font-semibold whitespace-nowrap text-white sm:text-4xl">
          {word}
          <Sparkles className="size-5 text-amber-200 sm:size-7" />
        </span>
      ))}
    </div>
  );
  return (
    <div aria-hidden="true" className="relative overflow-hidden py-6">
      {/* Wider than the screen so the tilted band's ends stay hidden. */}
      <div className="bg-sunset -mx-10 -rotate-2 py-4 shadow-lg">
        <div className="flex w-max animate-marquee [animation-duration:45s]">
          {row}
          {row}
        </div>
      </div>
    </div>
  );
}

function SaleBanner({ discount }: { discount: number }) {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <Reveal>
          <div className="bg-sunset-deep relative grid animate-gradient items-center gap-6 overflow-hidden rounded-[2rem] bg-[length:200%_200%] px-6 py-12 text-white sm:px-12 sm:py-16 md:grid-cols-2">
            <span aria-hidden="true" className="absolute -top-20 -left-20 size-64 rounded-full bg-white/10" />
            <span aria-hidden="true" className="absolute -right-10 -bottom-24 size-80 rounded-full bg-amber-300/25 blur-2xl" />
            <div className="relative">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold tracking-widest uppercase">
                <Sparkles className="size-3.5" aria-hidden="true" />
                End of season sale
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                {discount > 0 ? `Up to ${discount}% off` : 'Fresh deals every week'}
              </h2>
              <p className="mt-3 max-w-sm text-white/85">Dresses, sneakers, bags and more, while stocks last.</p>
              <Link to="/shop?sale=1" className={cn('mt-8', buttonClasses({ variant: 'inverse', size: 'lg' }))}>
                Shop the sale
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="relative hidden justify-center md:flex" aria-hidden="true">
              <span className="absolute inset-0 m-auto grid size-64 place-items-center rounded-full bg-white/10 lg:size-80" />
              <img src={HERO_ART.sale} alt="" loading="lazy" className="relative w-72 animate-float drop-shadow-2xl lg:w-96" style={tilt(-8)} />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function Newsletter() {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Demo only: connect this to your email marketing provider.
    setSubscribed(true);
  };

  return (
    <section className="pt-16 sm:pt-24">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-amber-100 via-rose-100 to-violet-200 px-6 py-14 text-center sm:px-12">
            <span aria-hidden="true" className="absolute -top-16 -left-10 size-48 animate-blob rounded-full bg-white/40 blur-2xl" />
            <span aria-hidden="true" className="absolute -right-10 -bottom-16 size-56 animate-blob rounded-full bg-fuchsia-300/40 blur-2xl [animation-delay:-6s]" />
            <div className="relative">
              <p className="text-xs font-bold tracking-[0.2em] text-brand-700 uppercase">Join the club</p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Get 10% off your first order</h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-stone-700 sm:text-base">
                New arrivals, style notes and members-only offers, straight to your inbox.
              </p>
              {subscribed ? (
                <p className="mt-6 font-semibold text-emerald-700" role="status">
                  Thanks for subscribing! Check your inbox for your welcome code.
                </p>
              ) : (
                <form onSubmit={handleSubmit} className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="h-12 flex-1 rounded-full border border-white bg-white/90 px-5 text-base shadow-sm focus:border-brand-400 focus:ring-4 focus:ring-brand-500/15 focus:outline-none sm:text-sm"
                  />
                  <Button type="submit" size="lg">
                    Subscribe
                  </Button>
                </form>
              )}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export function HomePage() {
  usePageTitle();
  const products = useProducts();
  const ready = useCatalogStatus() === 'ready';

  return (
    <>
      <Hero />
      <Perks />
      <Collections />
      <CategoryRibbon />
      <section className="pt-16 sm:pt-20">
        <Container>
          <SectionHeading eyebrow="Loved by customers" title="Best sellers" subtitle="The pieces everyone is talking about." link={{ label: 'View all', to: '/shop?sort=rating' }} />
          {ready ? <ProductGrid products={getBestsellers(products, 4)} /> : <ProductGridSkeleton />}
        </Container>
      </section>
      <SaleBanner discount={maxDiscountPercent(products)} />
      <section className="bg-gradient-to-b from-violet-50 via-white to-white py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Just landed" title="New arrivals" subtitle="Fresh styles added this week." link={{ label: 'Shop new', to: '/shop?sort=newest' }} />
          {ready ? <ProductGrid products={getNewArrivals(products, 4)} /> : <ProductGridSkeleton />}
        </Container>
      </section>
      <Newsletter />
    </>
  );
}
