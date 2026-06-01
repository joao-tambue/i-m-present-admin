'use client';

import { Header } from '@/components/admin/header';
import { QRCodeTable } from '@/components/admin/qrcode-table';
import { useQRCode } from '@/hooks/use-qrcode';
import { useCallback, useEffect, useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';

export default function QRCodesPage() {
  const {
    qrCodes,
    error,
    fetchQRCodes,
    regenerateQRCode,
    revokeQRCode,
    isLoading,
    isRegenerating,
    isRevoking,
    regeneratingId,
    revokingId,
    clearError,
    total,
  } = useQRCode();

  const [searchTerm, setSearchTerm] = useState('');

  const loadQRCodes = useCallback(() => {
    fetchQRCodes(1, 50, searchTerm || undefined).catch(() => {
      // Error handled in store
    });
  }, [fetchQRCodes, searchTerm]);

  useEffect(() => {
    const timeout = window.setTimeout(loadQRCodes, 350);

    return () => window.clearTimeout(timeout);
  }, [loadQRCodes]);

  const handleRegenerate = async (employeeId: string) => {
    try {
      await regenerateQRCode(employeeId);
    } catch {
      // Error is shown below
    }
  };

  const handleRevoke = async (employeeId: string) => {
    try {
      await revokeQRCode(employeeId);
    } catch {
      // Error is shown below
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <Header
        title="Gestão de QR Codes"
        description="Gerenciar e controlar QR Codes dos funcionários"
      />

      <main className="flex-1 p-8 space-y-6">
        {/* Search Bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-64 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Procurar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="text-sm text-gray-600 font-medium">
            Total: <span className="font-bold text-purple-600">{total}</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-red-900">Erro</h3>
              <p className="text-red-800 text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-900 font-medium text-sm"
            >
              Fechar
            </button>
          </div>
        )}

        {/* Table */}
        <QRCodeTable
          qrCodes={qrCodes}
          isLoading={isLoading}
          onRegenerateClick={handleRegenerate}
          onRevokeClick={handleRevoke}
          regeneratingId={regeneratingId}
          revokingId={revokingId}
        />
      </main>
    </div>
  );
}
