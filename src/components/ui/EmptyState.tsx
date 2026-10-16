import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center px-4 py-16 text-center', className)}>
      <div className="grid size-16 place-items-center rounded-full bg-gradient-to-br from-brand-100 to-violet-100">
        <Icon className="size-7 text-brand-600" aria-hidden="true" />
      </div>
      <h2 className="mt-5 text-lg font-semibold">{title}</h2>
      {description && <p className="mt-2 max-w-sm text-sm text-stone-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
