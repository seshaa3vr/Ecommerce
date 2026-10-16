import { Mail, Phone } from 'lucide-react';
import { Link } from 'react-router';
import { STORE_NAME, STORE_TAGLINE, SUPPORT_EMAIL, SUPPORT_PHONE } from '../../config';
import { categories } from '../../data/categories';
import { Container } from '../ui/Container';
import { SocialIcons } from '../ui/SocialIcons';

const columns = [
  {
    title: 'Shop',
    links: [
      { label: 'New in', to: '/shop?sort=newest' },
      ...categories.slice(0, 5).map((c) => ({ label: c.name, to: `/shop?category=${c.id}` })),
      { label: 'Sale', to: '/shop?sale=1' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Sign in', to: '/login' },
      { label: 'Create account', to: '/register' },
      { label: 'My orders', to: '/account' },
      { label: 'Wishlist', to: '/wishlist' },
      { label: 'Shopping bag', to: '/cart' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-24 bg-night text-violet-100/80">
      <div className="bg-sunset h-1.5" aria-hidden="true" />
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <p className="text-sunset font-display text-3xl font-semibold">{STORE_NAME}</p>
          <p className="max-w-xs text-sm text-violet-200/70">{STORE_TAGLINE} Free shipping on qualifying orders and 7-day easy returns.</p>
          <SocialIcons />
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h2 className="text-sm font-semibold text-white">{column.title}</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="transition-colors hover:text-brand-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h2 className="text-sm font-semibold text-white">Customer care</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a href={`mailto:${SUPPORT_EMAIL}`} className="flex items-center gap-2 hover:text-white">
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                {SUPPORT_EMAIL}
              </a>
            </li>
            <li>
              <a href={`tel:${SUPPORT_PHONE.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-white">
                <Phone className="size-4 shrink-0" aria-hidden="true" />
                {SUPPORT_PHONE}
              </a>
            </li>
            <li className="text-violet-200/70">Mon–Sat, 10am – 7pm IST</li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-6 text-xs text-violet-200/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {STORE_NAME}. All rights reserved.
          </p>
          <p>We accept Visa · Mastercard · RuPay · UPI · Cash on delivery</p>
        </Container>
      </div>
    </footer>
  );
}
