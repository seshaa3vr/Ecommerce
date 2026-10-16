import { Search } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { cn } from '../../utils/cn';

interface SearchFormProps {
  className?: string;
  autoFocus?: boolean;
  onSearch?: () => void;
}

export function SearchForm({ className, autoFocus, onSearch }: SearchFormProps) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const currentQuery = params.get('q') ?? '';
  const [value, setValue] = useState(currentQuery);

  // Keep the box in sync when the query changes elsewhere, e.g. "Clear all" on the shop page.
  useEffect(() => {
    setValue(currentQuery);
  }, [currentQuery]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const q = value.trim();
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop');
    onSearch?.();
  };

  return (
    <form role="search" onSubmit={handleSubmit} className={cn('relative', className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-stone-400" aria-hidden="true" />
      <input
        type="search"
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products"
        aria-label="Search products"
        enterKeyHint="search"
        autoFocus={autoFocus}
        className="h-10 w-full rounded-full border border-stone-200 bg-stone-100 pr-4 pl-10 text-base transition-colors placeholder:text-stone-500 focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:outline-none sm:text-sm"
      />
    </form>
  );
}
