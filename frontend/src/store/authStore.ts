import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserInfo } from '../types/auth.types';

interface AuthState {
  accessToken: string | null;
  user: UserInfo | null;
  login: (token: string, user: UserInfo) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      login: (token, user) => set({ accessToken: token, user }),
      logout: () => set({ accessToken: null, user: null }),
    }),
    { name: 'auth-storage' }
  )
);
