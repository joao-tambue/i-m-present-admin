'use client';

import { Sidebar } from '@/components/admin/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    fetchMe,
    hasHydrated,
    isAuthenticated,
    isCheckingSession,
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

    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [fetchMe, hasHydrated, isAuthenticated, router, token]);

  if (!hasHydrated || isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-purple-900 to-purple-800">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-300 border-t-white"></div>
          <p className="text-lg font-medium text-white">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
  <div className="bg-gray-50">
    <Sidebar />

    <main className="ml-64 min-h-screen flex-1">
      {children}
    </main>
  </div>
);
}
