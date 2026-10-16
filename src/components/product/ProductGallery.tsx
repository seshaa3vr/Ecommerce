import { useRef, useState } from 'react';
import { cn } from '../../utils/cn';

/**
 * Swipeable image strip (scroll-snap) on every screen size.
 * Phones get dots; larger screens also get clickable thumbnails.
 */
export function ProductGallery({ images, name, tint = 'bg-stone-100' }: { images: string[]; name: string; tint?: string }) {
  const stripRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const goTo = (index: number) => {
    const strip = stripRef.current;
    if (!strip) return;
    strip.scrollTo({ left: index * strip.clientWidth, behavior: 'smooth' });
    setActive(index);
  };

  const handleScroll = () => {
    const strip = stripRef.current;
    if (!strip) return;
    setActive(Math.round(strip.scrollLeft / strip.clientWidth));
  };

  return (
    <div className="flex flex-col gap-3 md:flex-row-reverse md:gap-4">
      <div className="relative min-w-0 flex-1">
        <div
          ref={stripRef}
          onScroll={handleScroll}
          className={cn('no-scrollbar flex snap-x snap-mandatory overflow-x-auto rounded-[2rem]', tint)}
          aria-label={`${name} photos`}
          role="region"
          tabIndex={0}
        >
          {images.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={`${name}, photo ${index + 1} of ${images.length}`}
              width={800}
              height={800}
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : undefined}
              className="aspect-square w-full shrink-0 snap-center object-contain p-8 drop-shadow-xl sm:p-12"
            />
          ))}
        </div>

        {images.length > 1 && (
          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5 md:hidden">
            {images.map((src, index) => (
              <button
                key={src}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Show photo ${index + 1}`}
                aria-current={active === index}
                className={cn('h-1.5 rounded-full transition-all', active === index ? 'bg-sunset-deep w-6' : 'w-1.5 bg-stone-400')}
              />
            ))}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="hidden gap-3 md:flex md:w-20 md:flex-col">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Show photo ${index + 1}`}
              aria-current={active === index}
              className={cn(
                'aspect-square overflow-hidden rounded-xl ring-2 transition',
                tint,
                active === index ? 'ring-brand-500' : 'ring-transparent hover:ring-brand-200',
              )}
            >
              <img src={src} alt="" className="size-full object-contain p-1.5" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
