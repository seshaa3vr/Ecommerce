import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import type { z } from 'zod';
import { loginSchema } from '../../shared/schemas.ts';
import { AuthCard } from '../components/auth/AuthCard';
import { PasswordInput } from '../components/auth/PasswordInput';
import { getRedirectTarget } from '../components/auth/RequireAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { usePageTitle } from '../hooks/usePageTitle';
import { errorMessage } from '../lib/api';
import { useAuthStore } from '../store/authStore';

const formSchema = loginSchema.pick({ email: true, password: true });
type LoginValues = z.infer<typeof formSchema>;

export function LoginPage() {
  usePageTitle('Sign in');
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = getRedirectTarget(location.state);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(formSchema), mode: 'onTouched' });

  if (user && !isSubmitting) return <Navigate to={redirectTo} replace />;

  const onSubmit = async (values: LoginValues) => {
    try {
      await login(values);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setError('root', { message: errorMessage(error) });
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to check out faster and track your orders."
      footer={
        <>
          New here?{' '}
          <Link to="/register" state={location.state} className="font-semibold text-stone-900 underline-offset-4 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {errors.root && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {errors.root.message}
          </p>
        )}
        <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <PasswordInput label="Password" autoComplete="current-password" error={errors.password?.message} {...register('password')} />
        <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
          Sign in
        </Button>
      </form>
    </AuthCard>
  );
}
