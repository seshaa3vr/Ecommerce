import { zodResolver } from '@hookform/resolvers/zod';
import { Banknote, CreditCard, Lock, ShoppingBag, Smartphone, type LucideIcon } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { z } from 'zod';
import { shippingSchema, upiIdPattern, type PlaceOrderInput } from '../../shared/schemas.ts';
import { CartLineItem } from '../components/cart/CartLineItem';
import { OrderSummary } from '../components/cart/OrderSummary';
import { Button, buttonClasses } from '../components/ui/Button';
import { Container } from '../components/ui/Container';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';
import { usePageTitle } from '../hooks/usePageTitle';
import { ApiError, api, errorMessage } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useCatalogStore } from '../store/catalogStore';
import { toast } from '../store/toastStore';
import type { Order, PaymentMethod, ShippingAddress } from '../types';
import { calculateTotals } from '../utils/cart';
import { cn } from '../utils/cn';
import { formatPrice } from '../utils/format';

const digits = (value = '') => value.replace(/\D/g, '');

function isFutureExpiry(value: string) {
  const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value.trim());
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  const now = new Date();
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
}

// Address rules are shared with the server; card details are only checked here and never sent.
const checkoutSchema = shippingSchema
  .extend({
    paymentMethod: z.enum(['card', 'upi', 'cod']),
    cardNumber: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCvc: z.string().optional(),
    upiId: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    const issue = (path: string, message: string) => ctx.addIssue({ code: 'custom', path: [path], message });
    if (values.paymentMethod === 'card') {
      if (digits(values.cardNumber).length !== 16) issue('cardNumber', 'Enter the 16-digit card number');
      if (!isFutureExpiry(values.cardExpiry ?? '')) issue('cardExpiry', 'Enter a valid expiry date (MM/YY)');
      if (!/^\d{3,4}$/.test(values.cardCvc ?? '')) issue('cardCvc', 'Enter the 3 or 4-digit CVV');
    }
    if (values.paymentMethod === 'upi' && !upiIdPattern.test(values.upiId?.trim() ?? '')) {
      issue('upiId', 'Enter a valid UPI ID, e.g. name@bank');
    }
  });

type CheckoutValues = z.infer<typeof checkoutSchema>;

const shippingFields: (keyof ShippingAddress)[] = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];

const paymentOptions: { id: PaymentMethod; label: string; description: string; icon: LucideIcon }[] = [
  { id: 'card', label: 'Credit / Debit card', description: 'Visa, Mastercard, RuPay', icon: CreditCard },
  { id: 'upi', label: 'UPI', description: 'Google Pay, PhonePe, Paytm', icon: Smartphone },
  { id: 'cod', label: 'Cash on delivery', description: 'Pay when your order arrives', icon: Banknote },
];

function FormSection({ step, title, children }: { step: number; title: string; children: ReactNode }) {
  return (
    <section className="border-b border-stone-200 pb-8">
      <h2 className="flex items-center gap-3 text-lg font-semibold">
        <span className="bg-sunset-deep grid size-8 place-items-center rounded-full text-xs text-white shadow-md shadow-fuchsia-700/20">{step}</span>
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function CheckoutPage() {
  usePageTitle('Checkout');
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const reloadCatalog = useCatalogStore((s) => s.load);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const totals = calculateTotals(items);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onTouched',
    defaultValues: {
      email: user?.email ?? '',
      fullName: user?.name ?? '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      paymentMethod: 'card',
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
      upiId: '',
    },
  });
  const paymentMethod = watch('paymentMethod');

  const onSubmit = async (values: CheckoutValues) => {
    const { fullName, email, phone, address, city, state, pincode } = values;
    const shipping: ShippingAddress = { fullName, email, phone, address, city, state, pincode };
    const payment: PlaceOrderInput['payment'] =
      values.paymentMethod === 'card'
        ? { method: 'card', cardLast4: digits(values.cardNumber).slice(-4) }
        : values.paymentMethod === 'upi'
          ? { method: 'upi', upiId: values.upiId?.trim() ?? '' }
          : { method: 'cod' };

    try {
      await new Promise((resolve) => setTimeout(resolve, 800)); // simulated payment authorisation
      const body: PlaceOrderInput = {
        items: items.map(({ productId, size, color, quantity }) => ({ productId, size, color, quantity })),
        shipping,
        payment,
      };
      const { order } = await api<{ order: Order }>('/orders', { body });
      setOrderPlaced(true);
      navigate(`/order/${order.id}`, { replace: true });
      clearCart();
      void reloadCatalog(); // stock levels changed
    } catch (error) {
      if (error instanceof ApiError) {
        for (const [path, message] of Object.entries(error.fields)) {
          const field = path.replace(/^shipping\./, '') as keyof ShippingAddress;
          if (shippingFields.includes(field)) setError(field, { message });
        }
        // Prices or stock changed since the bag was filled: refresh so the bag reflects it.
        if (error.status === 409) void reloadCatalog();
      }
      setError('root', { message: errorMessage(error) });
      toast.error(errorMessage(error));
    }
  };

  if (items.length === 0) {
    // Right after placing an order the cart empties before the confirmation page renders.
    if (orderPlaced) return null;
    return (
      <Container className="py-12">
        <EmptyState
          icon={ShoppingBag}
          title="Your bag is empty"
          description="Add something to your bag before checking out."
          action={
            <Link to="/shop" className={buttonClasses({ size: 'lg' })}>
              Continue shopping
            </Link>
          }
        />
      </Container>
    );
  }

  return (
    <Container className="py-8 sm:py-12">
      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Checkout</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_26rem] lg:items-start">
        <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">
          {errors.root && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {errors.root.message}
            </p>
          )}
          <FormSection step={1} title="Contact">
            <div className="grid gap-5 sm:grid-cols-2">
              <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
              <Input
                label="Mobile number"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="98765 43210"
                error={errors.phone?.message}
                {...register('phone')}
              />
            </div>
          </FormSection>

          <FormSection step={2} title="Shipping address">
            <div className="grid gap-5 sm:grid-cols-2">
              <Input label="Full name" autoComplete="name" className="sm:col-span-2" error={errors.fullName?.message} {...register('fullName')} />
              <Input
                label="Address"
                autoComplete="street-address"
                placeholder="House no., building, street, area"
                className="sm:col-span-2"
                error={errors.address?.message}
                {...register('address')}
              />
              <Input label="City" autoComplete="address-level2" error={errors.city?.message} {...register('city')} />
              <Input label="State" autoComplete="address-level1" error={errors.state?.message} {...register('state')} />
              <Input
                label="PIN code"
                autoComplete="postal-code"
                inputMode="numeric"
                maxLength={6}
                error={errors.pincode?.message}
                {...register('pincode')}
              />
            </div>
          </FormSection>

          <FormSection step={3} title="Payment">
            <fieldset>
              <legend className="sr-only">Payment method</legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {paymentOptions.map(({ id, label, description, icon: Icon }) => (
                  <label
                    key={id}
                    className={cn(
                      'flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition-colors has-focus-visible:ring-2 has-focus-visible:ring-brand-500',
                      paymentMethod === id ? 'border-brand-500 bg-brand-50' : 'border-stone-200 hover:border-brand-200',
                    )}
                  >
                    <input type="radio" value={id} className="sr-only" {...register('paymentMethod')} />
                    <Icon className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden="true" />
                    <span>
                      <span className="block text-sm font-semibold">{label}</span>
                      <span className="block text-xs text-stone-500">{description}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-6">
              {paymentMethod === 'card' && (
                <div className="grid grid-cols-2 gap-5">
                  <Input
                    label="Card number"
                    autoComplete="cc-number"
                    inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="col-span-2"
                    error={errors.cardNumber?.message}
                    {...register('cardNumber')}
                  />
                  <Input label="Expiry" autoComplete="cc-exp" placeholder="MM/YY" maxLength={5} error={errors.cardExpiry?.message} {...register('cardExpiry')} />
                  <Input
                    label="CVV"
                    type="password"
                    autoComplete="cc-csc"
                    inputMode="numeric"
                    maxLength={4}
                    error={errors.cardCvc?.message}
                    {...register('cardCvc')}
                  />
                </div>
              )}
              {paymentMethod === 'upi' && (
                <Input label="UPI ID" placeholder="yourname@bank" autoComplete="off" error={errors.upiId?.message} {...register('upiId')} />
              )}
              {paymentMethod === 'cod' && (
                <p className="rounded-2xl bg-stone-50 p-4 text-sm text-stone-600">
                  Pay {formatPrice(totals.total)} in cash or by UPI when your order is delivered.
                </p>
              )}
              <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-xs text-amber-800">
                Demo store: no real payment is taken. Any valid-looking details work, for example card 4242 4242 4242 4242, expiry 12/30, CVV 123.
              </p>
            </div>
          </FormSection>
        </form>

        <aside aria-labelledby="checkout-summary" className="rounded-[2rem] bg-gradient-to-br from-brand-50 via-white to-violet-50 p-6 ring-1 ring-brand-100 lg:sticky lg:top-24">
          <h2 id="checkout-summary" className="text-lg font-semibold">
            Order summary
          </h2>
          <ul className="my-4 max-h-80 divide-y divide-stone-200 overflow-y-auto border-y border-stone-200">
            {items.map((item) => (
              <CartLineItem key={item.key} item={item} readOnly />
            ))}
          </ul>
          <OrderSummary totals={totals}>
            <Button type="submit" form="checkout-form" size="lg" fullWidth className="mt-6" loading={isSubmitting}>
              {!isSubmitting && <Lock className="size-4" aria-hidden="true" />}
              {isSubmitting ? 'Processing payment…' : `Place order · ${formatPrice(totals.total)}`}
            </Button>
            <Link to="/cart" className="mt-4 block text-center text-sm text-stone-600 underline-offset-4 hover:underline">
              Edit bag
            </Link>
          </OrderSummary>
        </aside>
      </div>
    </Container>
  );
}
