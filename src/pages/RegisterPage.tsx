import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import { z } from 'zod';
import { registerSchema } from '../../shared/schemas.ts';
import { AuthCard } from '../components/auth/AuthCard';
import { PasswordInput } from '../components/auth/PasswordInput';
import { getRedirectTarget } from '../components/auth/RequireAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { usePageTitle } from '../hooks/usePageTitle';
import { ApiError, errorMessage } from '../lib/api';
import { useAuthStore } from '../store/authStore';

const formSchema = registerSchema.extend({ confirmPassword: z.string() }).refine((v) => v.password === v.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterValues = z.infer<typeof formSchema>;

export function RegisterPage() {
  usePageTitle('Create account');
  const user = useAuthStore((s) => s.user);
  const registerUser = useAuthStore((s) => s.register);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = getRedirectTarget(location.state);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({ resolver: zodResolver(formSchema), mode: 'onTouched' });

  if (user && !isSubmitting) return <Navigate to={redirectTo} replace />;

  const onSubmit = async ({ name, email, password }: RegisterValues) => {
    try {
      await registerUser({ name, email, password });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      if (error instanceof ApiError && error.fields.email) setError('email', { message: error.fields.email });
      else setError('root', { message: errorMessage(error) });
    }
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Save your details for faster checkout and order tracking."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" state={location.state} className="font-semibold text-stone-900 underline-offset-4 hover:underline">
            Sign in
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
        <Input label="Full name" autoComplete="name" error={errors.name?.message} {...register('name')} />
        <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <PasswordInput
          label="Password"
          autoComplete="new-password"
          hint="At least 8 characters"
          error={errors.password?.message}
          {...register('password')}
        />
        <PasswordInput label="Confirm password" autoComplete="new-password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
        <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
          Create account
        </Button>
      </form>
    </AuthCard>
  );
}
