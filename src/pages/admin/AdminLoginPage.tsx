import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import type { z } from 'zod';
import { loginSchema } from '../../../shared/schemas.ts';
import { PasswordInput } from '../../components/auth/PasswordInput';
import { getRedirectTarget } from '../../components/auth/RequireAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { STORE_NAME } from '../../config';
import { usePageTitle } from '../../hooks/usePageTitle';
import { errorMessage } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

const formSchema = loginSchema.pick({ email: true, password: true });
type AdminLoginValues = z.infer<typeof formSchema>;

export function AdminLoginPage() {
  usePageTitle('Admin sign in');
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = getRedirectTarget(location.state, '/admin');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginValues>({ resolver: zodResolver(formSchema), mode: 'onTouched' });

  if (user?.role === 'admin' && !isSubmitting) return <Navigate to={redirectTo} replace />;

  const onSubmit = async (values: AdminLoginValues) => {
    try {
      await login({ ...values, asAdmin: true });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setError('root', { message: errorMessage(error) });
    }
  };

  return (
    <div className="grid min-h-dvh place-items-center bg-gradient-to-br from-brand-50 via-violet-50 to-amber-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-3xl bg-white p-6 shadow-xl shadow-stone-900/5 sm:p-10">
          <div className="bg-sunset grid size-12 place-items-center rounded-2xl text-white shadow-lg shadow-fuchsia-600/30">
            <ShieldCheck className="size-6" aria-hidden="true" />
          </div>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight">{STORE_NAME} admin</h1>
          <p className="mt-1 text-sm text-stone-500">Sign in to manage products and orders.</p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
            {errors.root && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                {errors.root.message}
              </p>
            )}
            <Input label="Admin email" type="email" autoComplete="username" error={errors.email?.message} {...register('email')} />
            <PasswordInput label="Password" autoComplete="current-password" error={errors.password?.message} {...register('password')} />
            <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
              Sign in to admin
            </Button>
          </form>
        </div>
        <p className="mt-6 text-center text-sm text-stone-500">
          <Link to="/" className="underline-offset-4 hover:text-stone-900 hover:underline">
            ← Back to the store
          </Link>
        </p>
      </div>
    </div>
  );
}
