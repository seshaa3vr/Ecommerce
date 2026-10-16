import { create } from 'zustand';
import { api } from '../lib/api';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  /** "loading" until the first /auth/me check finishes, so guards don't redirect too early. */
  status: 'loading' | 'ready';
  init: () => Promise<void>;
  login: (credentials: { email: string; password: string; asAdmin?: boolean }) => Promise<User>;
  register: (details: { name: string; email: string; password: string }) => Promise<User>;
  logout: () => Promise<void>;
}

/** Sessions live in an httpOnly cookie set by the server; this store only mirrors who is signed in. */
export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  status: 'loading',

  init: async () => {
    try {
      const { user } = await api<{ user: User | null }>('/auth/me');
      set({ user, status: 'ready' });
    } catch {
      set({ user: null, status: 'ready' });
    }
  },

  login: async (credentials) => {
    const { user } = await api<{ user: User }>('/auth/login', { body: credentials });
    set({ user });
    return user;
  },

  register: async (details) => {
    const { user } = await api<{ user: User }>('/auth/register', { body: details });
    set({ user });
    return user;
  },

  logout: async () => {
    await api('/auth/logout', { method: 'POST' }).catch(() => undefined);
    set({ user: null });
  },
}));
