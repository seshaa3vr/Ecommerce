import { ArrowLeft, ImagePlus, LoaderCircle, Plus, Star, X } from 'lucide-react';
import { useState, type ChangeEvent, type ReactNode } from 'react';
import { useFieldArray, useForm, type FieldErrors, type Resolver } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router';
import { productInputSchema, type ProductInput } from '../../../shared/schemas.ts';
import { AdminPageHeader } from '../../components/admin/AdminLayout';
import { Button, buttonClasses } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { Select, Textarea } from '../../components/ui/FormControls';
import { Input } from '../../components/ui/Input';
import { PageLoader } from '../../components/ui/Loading';
import { categories } from '../../data/categories';
import { usePageTitle } from '../../hooks/usePageTitle';
import { api, ApiError, errorMessage } from '../../lib/api';
import { useCatalogStatus, useCatalogStore, useProducts } from '../../store/catalogStore';
import { toast } from '../../store/toastStore';
import type { CategoryId, Gender, Product } from '../../types';
import { cn } from '../../utils/cn';

/** Form state keeps numbers and lists as text so inputs can be edited freely; it's converted on validation. */
interface FormValues {
  name: string;
  brand: string;
  category: CategoryId | '';
  gender: Gender;
  price: string;
  originalPrice: string;
  stock: string;
  sizes: string;
  colors: { name: string; hex: string }[];
  images: string[];
  description: string;
  details: string;
  isNew: boolean;
  isBestseller: boolean;
}

const sizePresets = [
  { label: 'XS – XL', value: 'XS, S, M, L, XL' },
  { label: 'S – XXL', value: 'S, M, L, XL, XXL' },
  { label: 'UK 3 – 8', value: 'UK 3, UK 4, UK 5, UK 6, UK 7, UK 8' },
  { label: 'UK 6 – 11', value: 'UK 6, UK 7, UK 8, UK 9, UK 10, UK 11' },
  { label: 'One size', value: '' },
];

const splitList = (text: string, separator: RegExp) =>
  text
    .split(separator)
    .map((s) => s.trim())
    .filter(Boolean);

const toNumber = (text: string) => (text.trim() === '' ? Number.NaN : Number(text));

function toInput(values: FormValues) {
  return {
    ...values,
    price: toNumber(values.price),
    originalPrice: values.originalPrice.trim() === '' ? null : toNumber(values.originalPrice),
    stock: toNumber(values.stock),
    sizes: splitList(values.sizes, /,/),
    details: splitList(values.details, /\n/),
  };
}

function toFormValues(product?: Product): FormValues {
  return {
    name: product?.name ?? '',
    brand: product?.brand ?? '',
    category: product?.category ?? '',
    gender: product?.gender ?? 'women',
    price: product ? String(product.price) : '',
    originalPrice: product?.originalPrice ? String(product.originalPrice) : '',
    stock: product ? String(product.stock) : '',
    sizes: product?.sizes.join(', ') ?? '',
    colors: product?.colors ?? [{ name: '', hex: '#1c1917' }],
    images: product?.images ?? [],
    description: product?.description ?? '',
    details: product?.details.join('\n') ?? '',
    isNew: product?.isNew ?? true,
    isBestseller: product?.isBestseller ?? false,
  };
}

/** Validates with the exact schema the server uses, reporting each problem on the matching form field. */
const resolver: Resolver<FormValues> = async (values) => {
  const result = productInputSchema.safeParse(toInput(values));
  if (result.success) return { values, errors: {} };
  const errors: Record<string, { type: string; message: string }> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? 'root');
    errors[key] ??= { type: 'validation', message: issue.message };
  }
  return { values: {}, errors: errors as FieldErrors<FormValues> };
};

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
      <h2 className="font-semibold">{title}</h2>
      {description && <p className="mt-1 text-sm text-stone-500">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function ProductFormPage() {
  const { id } = useParams();
  const products = useProducts();
  const status = useCatalogStatus();
  const product = id ? products.find((p) => p.id === Number(id)) : undefined;
  usePageTitle(id ? 'Edit product · Admin' : 'Add product · Admin');

  if (id && !product) {
    if (status !== 'ready') return <PageLoader />;
    return (
      <EmptyState
        icon={X}
        title="Product not found"
        description="It may have been deleted."
        action={
          <Link to="/admin/products" className={buttonClasses()}>
            Back to products
          </Link>
        }
      />
    );
  }
  return <ProductForm key={product?.id ?? 'new'} product={product} />;
}

function ProductForm({ product }: { product?: Product }) {
  const navigate = useNavigate();
  const upsert = useCatalogStore((s) => s.upsert);
  const [uploading, setUploading] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver, defaultValues: toFormValues(product), mode: 'onTouched' });
  const colors = useFieldArray({ control, name: 'colors' });
  const images = watch('images');

  const uploadPhotos = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (files.length === 0) return;
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    setUploading(true);
    try {
      const { urls } = await api<{ urls: string[] }>('/admin/uploads', { formData });
      setValue('images', [...images, ...urls], { shouldValidate: true, shouldDirty: true });
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setUploading(false);
    }
  };

  const moveToFront = (index: number) =>
    setValue('images', [images[index], ...images.filter((_, i) => i !== index)], { shouldDirty: true });
  const removeImage = (index: number) =>
    setValue('images', images.filter((_, i) => i !== index), { shouldValidate: true, shouldDirty: true });

  const onSubmit = async (values: FormValues) => {
    const body = toInput(values) as ProductInput;
    try {
      const { product: saved } = await api<{ product: Product }>(product ? `/admin/products/${product.id}` : '/admin/products', {
        method: product ? 'PUT' : 'POST',
        body,
      });
      upsert(saved);
      toast.success(product ? `Saved ${saved.name}` : `Added ${saved.name} to the store`);
      navigate('/admin/products');
    } catch (error) {
      if (error instanceof ApiError) {
        for (const [path, message] of Object.entries(error.fields)) {
          setError(path.split('.')[0] as keyof FormValues, { message });
        }
      }
      toast.error(errorMessage(error));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Link to="/admin/products" className="mb-4 inline-flex items-center gap-1.5 text-sm text-stone-600 hover:text-stone-900">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Products
      </Link>
      <AdminPageHeader
        title={product ? 'Edit product' : 'Add product'}
        description={product ? `Changes go live in the store as soon as you save.` : 'New products appear at the top of the shop.'}
        actions={
          product && (
            <Link to={`/product/${product.slug}`} target="_blank" className={buttonClasses({ variant: 'secondary', size: 'sm' })}>
              View in store
            </Link>
          )
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
        <div className="space-y-6">
          <Section title="Basic details">
            <div className="grid gap-5 sm:grid-cols-2">
              <Input label="Product name" className="sm:col-span-2" error={errors.name?.message} {...register('name')} />
              <Input label="Brand" error={errors.brand?.message} {...register('brand')} />
              <Select label="Category" error={errors.category?.message} {...register('category')}>
                <option value="">Choose a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
              <Select label="Shop for" error={errors.gender?.message} {...register('gender')}>
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="unisex">Everyone (unisex)</option>
              </Select>
            </div>
          </Section>

          <Section title="Photos" description="JPG, PNG, WebP or AVIF, up to 5 MB each. The first photo is the main one.">
            <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {images.map((src, index) => (
                <li key={src} className="group relative aspect-square overflow-hidden rounded-xl bg-stone-100">
                  <img src={src} alt={`Photo ${index + 1}`} className="size-full object-contain p-2" />
                  {index === 0 ? (
                    <span className="absolute bottom-1.5 left-1.5 rounded-full bg-stone-900 px-2 py-0.5 text-[10px] font-semibold text-white">Main</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => moveToFront(index)}
                      className="absolute bottom-1.5 left-1.5 grid size-7 place-items-center rounded-full bg-white/90 text-stone-700 shadow-sm hover:text-amber-600"
                      aria-label={`Make photo ${index + 1} the main photo`}
                      title="Make main photo"
                    >
                      <Star className="size-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1.5 right-1.5 grid size-7 place-items-center rounded-full bg-white/90 text-stone-700 shadow-sm hover:text-red-600"
                    aria-label={`Remove photo ${index + 1}`}
                  >
                    <X className="size-3.5" />
                  </button>
                </li>
              ))}
              {images.length < 10 && (
                <li>
                  <label
                    className={cn(
                      'flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed text-xs font-medium transition-colors has-focus-visible:ring-2 has-focus-visible:ring-stone-900',
                      errors.images ? 'border-red-400 text-red-600' : 'border-stone-300 text-stone-500 hover:border-stone-500 hover:text-stone-700',
                    )}
                  >
                    {uploading ? <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> : <ImagePlus className="size-5" aria-hidden="true" />}
                    {uploading ? 'Uploading…' : 'Add photos'}
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple className="sr-only" onChange={uploadPhotos} disabled={uploading} />
                  </label>
                </li>
              )}
            </ul>
            {errors.images && <p className="mt-2 text-sm text-red-600">{errors.images.message}</p>}
          </Section>

          <Section title="Sizes and colours">
            <Input
              label="Sizes"
              placeholder="e.g. S, M, L, XL (leave empty for one size)"
              hint="Separate sizes with commas."
              error={errors.sizes?.message}
              {...register('sizes')}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {sizePresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setValue('sizes', preset.value, { shouldDirty: true })}
                  className="rounded-full border border-stone-300 px-3 py-1 text-xs font-medium text-stone-600 hover:border-stone-900 hover:text-stone-900"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <fieldset className="mt-6">
              <legend className="mb-2 text-sm font-medium text-stone-800">Colours</legend>
              <div className="space-y-2">
                {colors.fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <input
                      type="color"
                      aria-label={`Colour ${index + 1} swatch`}
                      className="h-11 w-12 shrink-0 cursor-pointer rounded-lg border border-stone-300 bg-white p-1"
                      {...register(`colors.${index}.hex`)}
                    />
                    <input
                      placeholder="Colour name, e.g. Navy"
                      aria-label={`Colour ${index + 1} name`}
                      className="h-11 min-w-0 flex-1 rounded-lg border border-stone-300 bg-white px-3.5 text-base focus:border-stone-900 focus:ring-4 focus:ring-stone-900/10 focus:outline-none sm:text-sm"
                      {...register(`colors.${index}.name`)}
                    />
                    <button
                      type="button"
                      onClick={() => colors.remove(index)}
                      disabled={colors.fields.length === 1}
                      className="grid size-10 shrink-0 place-items-center rounded-full text-stone-500 hover:bg-stone-100 hover:text-red-600 disabled:opacity-30"
                      aria-label={`Remove colour ${index + 1}`}
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
              {errors.colors && <p className="mt-2 text-sm text-red-600">{errors.colors.message ?? 'Give every colour a name.'}</p>}
              <Button variant="ghost" size="sm" className="mt-2 -ml-2" onClick={() => colors.append({ name: '', hex: '#1c1917' })}>
                <Plus className="size-4" aria-hidden="true" />
                Add colour
              </Button>
            </fieldset>
          </Section>

          <Section title="Description">
            <div className="space-y-5">
              <Textarea label="Description" rows={4} error={errors.description?.message} {...register('description')} />
              <Textarea
                label="Product details"
                rows={4}
                placeholder={'100% cotton\nRegular fit\nMachine wash cold'}
                hint="One detail per line. Shown as bullet points."
                error={errors.details?.message}
                {...register('details')}
              />
            </div>
          </Section>
        </div>

        <div className="space-y-6 lg:sticky lg:top-8">
          <Section title="Pricing and stock">
            <div className="space-y-5">
              <Input label="Price (₹)" type="number" inputMode="numeric" min={1} step={1} error={errors.price?.message} {...register('price')} />
              <Input
                label="Original price (₹)"
                type="number"
                inputMode="numeric"
                min={1}
                step={1}
                hint="Optional. Set it higher than the price to show a sale."
                error={errors.originalPrice?.message}
                {...register('originalPrice')}
              />
              <Input label="Stock" type="number" inputMode="numeric" min={0} step={1} error={errors.stock?.message} {...register('stock')} />
            </div>
          </Section>

          <Section title="Labels">
            <div className="space-y-3 text-sm">
              <label className="flex items-center gap-3">
                <input type="checkbox" className="size-4 accent-stone-900" {...register('isNew')} />
                Show “New” badge
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="size-4 accent-stone-900" {...register('isBestseller')} />
                Feature in Best sellers
              </label>
            </div>
          </Section>

          <div className="flex gap-3">
            <Link to="/admin/products" className={buttonClasses({ variant: 'secondary', fullWidth: true })}>
              Cancel
            </Link>
            <Button type="submit" fullWidth loading={isSubmitting} disabled={uploading}>
              {product ? 'Save changes' : 'Add product'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
