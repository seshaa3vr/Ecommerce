import { Link } from 'react-router';
import { STORE_NAME } from '../../config';
import { cn } from '../../utils/cn';

export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <Link to="/" onClick={onClick} className={cn('flex items-center gap-2 font-display text-xl font-semibold tracking-tight', className)}>
      <span className="bg-sunset grid size-8 place-items-center rounded-xl text-sm text-white shadow-md shadow-fuchsia-600/30" aria-hidden="true">
        {STORE_NAME.charAt(0)}
      </span>
      {STORE_NAME}
    </Link>
  );
}
