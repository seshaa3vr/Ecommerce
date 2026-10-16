import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

const tones = {
  sale: 'bg-sunset-deep text-white shadow-sm',
  new: 'bg-violet-600 text-white shadow-sm',
  muted: 'bg-white text-stone-700 ring-1 ring-stone-200',
  success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
};

export function Badge({ tone = 'muted', children, className }: { tone?: keyof typeof tones; children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', tones[tone], className)}>
      {children}
    </span>
  );
}
