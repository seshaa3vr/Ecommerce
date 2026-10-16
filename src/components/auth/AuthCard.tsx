import type { ReactNode } from 'react';
import { Container } from '../ui/Container';

export function AuthCard({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer: ReactNode }) {
  return (
    <Container className="relative flex justify-center overflow-x-clip py-12 sm:py-20">
      <span aria-hidden="true" className="pointer-events-none absolute top-10 left-1/2 size-[28rem] -translate-x-1/2 animate-blob rounded-full bg-gradient-to-br from-fuchsia-200/50 to-amber-200/50 blur-3xl" />
      <div className="relative w-full max-w-md">
        <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-violet-900/5 ring-1 ring-stone-100">
          <div className="bg-sunset h-1.5" aria-hidden="true" />
          <div className="p-6 sm:p-10">
          <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-stone-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-stone-600">{footer}</p>
      </div>
    </Container>
  );
}
