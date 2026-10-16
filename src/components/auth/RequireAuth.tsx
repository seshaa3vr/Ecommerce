import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuthStore } from '../../store/authStore';
import { PageLoader } from '../ui/Loading';

interface RequireAuthProps {
  children: ReactNode;
  /** Only admins may pass; everyone else goes to the admin sign-in page. */
  admin?: boolean;
}

/** Sends visitors who aren't signed in (or aren't admins) to the right sign-in page, remembering where to return. */
export function RequireAuth({ children, admin = false }: RequireAuthProps) {
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  const location = useLocation();

  if (status === 'loading') return <PageLoader />;
  if (!user || (admin && user.role !== 'admin')) {
    return <Navigate to={admin ? '/admin/login' : '/login'} replace state={{ from: `${location.pathname}${location.search}` }} />;
  }
  return children;
}

/** Reads the post-login destination saved by RequireAuth. */
export function getRedirectTarget(state: unknown, fallback = '/account') {
  const from = (state as { from?: unknown } | null)?.from;
  return typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') ? from : fallback;
}
