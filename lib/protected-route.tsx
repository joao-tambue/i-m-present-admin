'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const {
    fetchMe,
    hasHydrated,
    isAuthenticated,
    isCheckingSession,
    isLoading,
    token,
  } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!hasHydrated) return;

    if (token) {
      fetchMe().catch(() => {
        router.push('/login');
      });
      return;
    }

    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [fetchMe, hasHydrated, isAuthenticated, isLoading, router, token]);

  if (!hasHydrated || isLoading || isCheckingSession) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 to-purple-800">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-300 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
