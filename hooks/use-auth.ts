'use client';

import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/auth-store';

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isCheckingSession = useAuthStore((state) => state.isCheckingSession);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const authError = useAuthStore((state) => state.error);
  const storeLogin = useAuthStore((state) => state.login);
  const fetchMe = useAuthStore((state) => state.fetchMe);
  const storeLogout = useAuthStore((state) => state.logout);
  const clearError = useAuthStore((state) => state.clearError);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        await storeLogin(email, password);
        toast.success('Login efetuado com sucesso.');
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Email ou senha inválidos.';

        toast.error(message);
        throw error;
      }
    },
    [storeLogin],
  );

  const logout = useCallback(() => {
    storeLogout();
    toast.success('Sessão terminada.');
  }, [storeLogout]);

  return {
    user,
    coordinator: user,
    token,
    isLoading,
    isCheckingSession,
    hasHydrated,
    isAuthenticated,
    authError,
    login,
    logout,
    fetchMe,
    clearError,
  };
}
