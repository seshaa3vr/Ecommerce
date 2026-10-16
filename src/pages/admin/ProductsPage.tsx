import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { AdminPageHeader } from '../../components/admin/AdminLayout';
import { buttonClasses, Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { PageLoader } from '../../components/ui/Loading';
import { categories, getCategoryName } from '../../data/categories';
import { usePageTitle } from '../../hooks/usePageTitle';
import { api, ApiError, errorMessage } from '../../lib/api';
import { useCatalogStatus, useCatalogStore, useProducts } from '../../store/catalogStore';
import { toast } from '../../store/toastStore';
import type { Product } from '../../types';
import { cn } from '../../utils/cn';
import { discountPercent } from '../../utils/format';

type Draft = { price: string; originalPrice: string; stock: string };

const toDraft = (p: Product): Draft => ({
  price: String(p.price),
  originalPrice: p.originalPrice ? String(p.originalPrice) : '',
  stock: String(p.stock),
});

function NumberCell({ label, value, onChange, error, placeholder }: { label: string; value: string; onChange: (v: string) => void; error?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-stone-500 md:sr-only">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        step={1}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        title={error}
        className={cn(
          'h-10 w-full rounded-lg border bg-white px-2.5 text-sm tabular-nums focus:ring-4 focus:outline-none',
          error ? 'border-red-500 focus:ring-red-500/15' : 'border-stone-300 focus:border-stone-900 focus:ring-stone-900/10',
        )}
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

/** One product with inline price and stock editing; "Save" appears once something changes. */
function ProductRow({ product, onDelete }: { product: Product; onDelete: (product: Product) => void }) {
  const upsert = useCatalogStore((s) => s.upsert);
  const [draft, setDraft] = useState(() => toDraft(product));
  const [errors, setErrors] = useState<Partial<Record<keyof Draft, string>>>({});
  const [saving, setSaving] = useState(false);
  const original = toDraft(product);
  const dirty = draft.price !== original.price || draft.originalPrice !== original.originalPrice || draft.stock !== original.stock;
  const discount = discountPercent(product.price, product.originalPrice);

  const update = (field: keyof Draft) => (value: string) => {
    setDraft((d) => ({ ...d, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const save = async () => {
    const toNumber = (v: string) => (v.trim() === '' ? Number.NaN : Number(v));
    setSaving(true);
    try {
      const { product: saved } = await api<{ product: Product }>(`/admin/products/${product.id}`, {
        method: 'PATCH',
        body: {
          price: toNumber(draft.price),
          originalPrice: draft.originalPrice.trim() === '' ? null : toNumber(draft.originalPrice),
          stock: toNumber(draft.stock),
        },
      });
      upsert(saved);
      setDraft(toDraft(saved));
      toast.success(`Saved ${saved.name}`);
    } catch (error) {
      if (error instanceof ApiError && Object.keys(error.fields).length) setErrors(error.fields);
      else toast.error(errorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <li className="grid grid-cols-[4rem_1fr] gap-x-4 gap-y-3 p-4 md:grid-cols-[3.5rem_minmax(0,1fr)_7rem_7rem_6rem_auto] md:items-center md:py-3">
      <img src={product.images[0]} alt="" className="size-16 rounded-xl bg-stone-100 object-contain p-1.5 md:size-14" />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{product.name}</p>
        <p className="truncate text-xs text-stone-500">
          {product.brand} · {getCategoryName(product.category)}
        </p>
        <div className="mt-1 flex flex-wrap gap-1.5 text-[11px] font-semibold">
          {discount > 0 && <span className="rounded-full bg-brand-50 px-2 py-0.5 text-brand-700">{discount}% off</span>}
          {product.stock === 0 && <span className="rounded-full bg-red-50 px-2 py-0.5 text-red-700">Sold out</span>}
          {product.stock > 0 && product.stock <= 5 && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-800">Low stock</span>}
        </div>
      </div>
      <div className="col-span-2 grid grid-cols-3 gap-3 md:contents">
        <NumberCell label="Price (₹)" value={draft.price} onChange={update('price')} error={errors.price} />
        <NumberCell label="Was (₹)" value={draft.originalPrice} onChange={update('originalPrice')} error={errors.originalPrice} placeholder="—" />
        <NumberCell label="Stock" value={draft.stock} onChange={update('stock')} error={errors.stock} />
      </div>
      <div className="col-span-2 flex items-center justify-end gap-1 md:col-span-1">
        {dirty && (
          <>
            <Button size="sm" variant="ghost" onClick={() => { setDraft(original); setErrors({}); }} disabled={saving}>
              Undo
            </Button>
            <Button size="sm" onClick={save} loading={saving}>
              Save
            </Button>
          </>
        )}
        <Link to={`/admin/products/${product.id}/edit`} className="grid size-9 place-items-center rounded-full text-stone-600 hover:bg-stone-100 hover:text-stone-900" aria-label={`Edit ${product.name}`} title="Edit">
          <Pencil className="size-4" />
        </Link>
        <button type="button" onClick={() => onDelete(product)} className="grid size-9 place-items-center rounded-full text-stone-600 hover:bg-red-50 hover:text-red-600" aria-label={`Delete ${product.name}`} title="Delete">
          <Trash2 className="size-4" />
        </button>
      </div>
    </li>
  );
}

export function ProductsPage() {
  usePageTitle('Products · Admin');
  const products = useProducts();
  const status = useCatalogStatus();
  const remove = useCatalogStore((s) => s.remove);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [busy, setBusy] = useState(false);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) => (!category || p.category === category) && (!q || `${p.name} ${p.brand}`.toLowerCase().includes(q)),
    );
  }, [products, query, category]);

  const confirmDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await api(`/admin/products/${deleting.id}`, { method: 'DELETE' });
      remove(deleting.id);
      toast.success(`Deleted ${deleting.name}`);
      setDeleting(null);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  if (status !== 'ready' && products.length === 0) return <PageLoader />;

  return (
    <>
      <AdminPageHeader
        title="Products"
        description={`${products.length} products in your store. Edit prices and stock right in the list.`}
        actions={
          <Link to="/admin/products/new" className={buttonClasses()}>
            <Plus className="size-4" aria-hidden="true" />
            Add product
          </Link>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-stone-400" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or brand"
            aria-label="Search products"
            className="h-11 w-full rounded-lg border border-stone-300 bg-white pr-3 pl-10 text-base focus:border-stone-900 focus:ring-4 focus:ring-stone-900/10 focus:outline-none sm:text-sm"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
          className="h-11 rounded-lg border border-stone-300 bg-white px-3 text-sm focus:border-stone-900 focus:outline-none"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div
          aria-hidden="true"
          className="hidden grid-cols-[3.5rem_minmax(0,1fr)_7rem_7rem_6rem_auto] gap-x-4 border-b border-stone-200 bg-stone-50 px-4 py-2.5 text-xs font-semibold tracking-wide text-stone-500 uppercase md:grid"
        >
          <span />
          <span>Product</span>
          <span>Price (₹)</span>
          <span>Was (₹)</span>
          <span>Stock</span>
          <span className="w-24" />
        </div>
        {visible.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-stone-500">No products match your search.</p>
        ) : (
          <ul className="divide-y divide-stone-100">
            {visible.map((product) => (
              // Keyed by the saved values so the inline editor resets if the product changes elsewhere.
              <ProductRow key={`${product.id}-${product.price}-${product.originalPrice}-${product.stock}`} product={product} onDelete={setDeleting} />
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete this product?"
        description={
          <>
            <strong>{deleting?.name}</strong> will be removed from the store and from customers' bags. Past orders keep their details. This can't be undone.
          </>
        }
        confirmLabel="Delete product"
        loading={busy}
        onConfirm={confirmDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}
