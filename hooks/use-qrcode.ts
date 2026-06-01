'use client';

import { useQRCodeStore } from '@/stores/qrcode-store';

export function useQRCode() {
  const {
    qrCodes,
    total,
    page,
    limit,
    totalPages,
    isLoading,
    isRegenerating,
    isRevoking,
    regeneratingId,
    revokingId,
    error,
    fetchQRCodes,
    regenerateQRCode,
    revokeQRCode,
    clearError,
  } = useQRCodeStore();

  return {
    qrCodes,
    total,
    page,
    limit,
    totalPages,
    isLoading,
    isRegenerating,
    isRevoking,
    regeneratingId,
    revokingId,
    error,
    fetchQRCodes,
    regenerateQRCode,
    revokeQRCode,
    clearError,
  };
}
