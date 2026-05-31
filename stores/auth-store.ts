'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AxiosError } from 'axios';
import { authService, AuthUser } from '@/services/auth-service';

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isCheckingSession: boolean;
  hasHydrated: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  fetchMe: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

function getAuthError(error: unknown) {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message;
    if (typeof message === 'string') return message;
  }

  if (error instanceof Error) return error.message;

  return 'Não foi possível autenticar. Tente novamente.';
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isCheckingSession: false,
      hasHydrated: false,
      error: null,
      isAuthenticated: false,

      async login(email, password) {
        set({ isLoading: true, error: null });

        try {
          const { token, user } = await authService.login({ email, password });

          if (user.role !== 'COORDINATOR') {
            throw new Error('Apenas coordenadores podem acessar o painel admin.');
          }

          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const message = getAuthError(error);

          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: message,
          });

          throw new Error(message);
        }
      },

      async fetchMe() {
        const { token, isCheckingSession } = get();

        if (!token || isCheckingSession) return;

        set({ isCheckingSession: true, error: null });

        try {
          const user = await authService.me();

          if (user.role !== 'COORDINATOR') {
            throw new Error('Apenas coordenadores podem acessar o painel admin.');
          }

          set({
            user,
            isAuthenticated: true,
            isCheckingSession: false,
          });
        } catch (error) {
          const message = getAuthError(error);

          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isCheckingSession: false,
            error: message,
          });

          throw new Error(message);
        }
      },

      logout() {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError() {
        set({ error: null });
      },

      setHasHydrated(hasHydrated) {
        set({ hasHydrated });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
