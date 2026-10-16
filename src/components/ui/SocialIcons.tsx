import type { ReactNode } from 'react';
import { SOCIAL_LINKS } from '../../config';

// lucide-react no longer ships brand logos, so these are simple outline marks.
const icons: Record<keyof typeof SOCIAL_LINKS, { label: string; svg: ReactNode }> = {
  instagram: {
    label: 'Instagram',
    svg: (
      <>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" />
      </>
    ),
  },
  facebook: {
    label: 'Facebook',
    svg: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  },
  x: {
    label: 'X',
    svg: (
      <>
        <path d="M4 4l11.7 16H20L8.3 4z" />
        <path d="M4 20l6.8-6.8M13.2 10.8L20 4" />
      </>
    ),
  },
  youtube: {
    label: 'YouTube',
    svg: (
      <>
        <path d="M2.5 17a24 24 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24 24 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
        <path d="m10 15 5-3-5-3z" />
      </>
    ),
  },
};

export function SocialIcons() {
  return (
    <ul className="flex gap-2">
      {(Object.keys(icons) as Array<keyof typeof icons>).map((key) => (
        <li key={key}>
          <a
            href={SOCIAL_LINKS[key]}
            target="_blank"
            rel="noreferrer"
            aria-label={icons[key].label}
            className="grid size-10 place-items-center rounded-full bg-white/10 text-violet-100 transition hover:-translate-y-0.5 hover:bg-sunset hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="size-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {icons[key].svg}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
