import { ClipboardList, ExternalLink, LayoutDashboard, LogOut, Menu, Package, type LucideIcon } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router';
import { STORE_NAME } from '../../config';
import { useAuthStore } from '../../store/authStore';
import { useCatalogStore } from '../../store/catalogStore';
import { cn } from '../../utils/cn';
import { Drawer } from '../ui/Drawer';

const navItems: { label: string; to: string; icon: LucideIcon; end?: boolean }[] = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Products', to: '/admin/products', icon: Package },
  { label: 'Orders', to: '/admin/orders', icon: ClipboardList },
];

function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const signOut = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="flex h-full flex-col">
      <nav aria-label="Admin" className="flex-1 space-y-1 p-3">
        {navItems.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'bg-sunset-deep text-white shadow-md shadow-fuchsia-700/20' : 'text-stone-600 hover:bg-brand-50 hover:text-brand-700',
              )
            }
          >
            <Icon className="size-5" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
        <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900">
          <ExternalLink className="size-5" aria-hidden="true" />
          View store
        </Link>
      </nav>
      <div className="border-t border-stone-200 p-4">
        <p className="truncate text-sm font-semibold">{user?.name}</p>
        <p className="truncate text-xs text-stone-500">{user?.email}</p>
        <button
          type="button"
          onClick={signOut}
          className="mt-3 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-stone-600 hover:bg-stone-100 hover:text-stone-900"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Sign out
        </button>
      </div>
    </div>
  );
}

function AdminBrand() {
  return (
    <Link to="/admin" className="flex items-center gap-2 font-display text-lg font-semibold">
      <span className="bg-sunset grid size-7 place-items-center rounded-lg text-sm text-white" aria-hidden="true">
        {STORE_NAME.charAt(0)}
      </span>
      {STORE_NAME}
      <span className="rounded-full bg-brand-100 px-2 py-0.5 font-sans text-[11px] font-semibold tracking-wide text-brand-700 uppercase">Admin</span>
    </Link>
  );
}

export function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const loadCatalog = useCatalogStore((s) => s.load);

  // Admins need current stock and prices, not whatever was loaded when the store was first opened.
  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog]);

  return (
    <div className="min-h-dvh bg-stone-50 lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-stone-200 bg-white lg:flex">
        <div className="flex h-16 items-center border-b border-stone-200 px-5">
          <AdminBrand />
        </div>
        <AdminNav />
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-stone-200 bg-white px-3 lg:hidden">
          <button type="button" onClick={() => setMenuOpen(true)} className="grid size-10 place-items-center rounded-full hover:bg-stone-100" aria-label="Open admin menu">
            <Menu className="size-5" />
          </button>
          <AdminBrand />
        </header>
        <main className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} side="left" title="Admin menu" maxWidthClassName="max-w-[85%] sm:max-w-xs">
        <AdminNav onNavigate={() => setMenuOpen(false)} />
      </Drawer>
    </div>
  );
}

export function AdminPageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-stone-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
