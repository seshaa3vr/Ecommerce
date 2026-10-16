import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

interface SectionHeadingProps {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  link?: { label: string; to: string };
}

export function SectionHeading({ title, eyebrow, subtitle, link }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10">
      <div>
        {eyebrow && <p className="mb-2 text-xs font-bold tracking-[0.2em] text-brand-600 uppercase">{eyebrow}</p>}
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-stone-500 sm:text-base">{subtitle}</p>}
      </div>
      {link && (
        <Link
          to={link.to}
          className="group flex shrink-0 items-center gap-1.5 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-100"
        >
          {link.label}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
