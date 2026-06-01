'use client';

import { create } from 'zustand';
import {
  QRCodeWithEmployee,
  getQRCodeError,
  qrcodeService,
} from '@/services/qrcode-service';

type QRCodeState = {
  qrCodes: QRCodeWithEmployee[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  isRegenerating: boolean;
  isRevoking: boolean;
  regeneratingId: string | null;
  revokingId: string | null;
  error: string | null;
  fetchQRCodes: (page?: number, limit?: number, search?: string) => Promise<void>;
  regenerateQRCode: (employeeId: string) => Promise<void>;
  revokeQRCode: (employeeId: string) => Promise<void>;
  clearError: () => void;
};

export const useQRCodeStore = create<QRCodeState>((set, get) => ({
  qrCodes: [],
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 1,
  isLoading: false,
  isRegenerating: false,
  isRevoking: false,
  regeneratingId: null,
  revokingId: null,
  error: null,

  async fetchQRCodes(page = 1, limit = 20, search) {
    set({ isLoading: true, error: null });

    try {
      const result = await qrcodeService.listQRCodes(page, limit, search);

      set({
        qrCodes: result.data,
        total: result.meta.total,
        page: result.meta.page,
        limit: result.meta.limit,
        totalPages: result.meta.totalPages,
        isLoading: false,
      });
    } catch (error) {
      const message = getQRCodeError(error);

      set({
        qrCodes: [],
        total: 0,
        isLoading: false,
        error: message,
      });

      throw new Error(message);
    }
  },

  async regenerateQRCode(employeeId: string) {
    set({ isRegenerating: true, regeneratingId: employeeId, error: null });

    try {
      await qrcodeService.regenerateQRCode(employeeId);

      // Refetch the list to get updated data
      const state = get();
      await state.fetchQRCodes(state.page, state.limit);

      set({ isRegenerating: false, regeneratingId: null });
    } catch (error) {
      const message = getQRCodeError(error);

      set({
        isRegenerating: false,
        regeneratingId: null,
        error: message,
      });

      throw new Error(message);
    }
  },

  async revokeQRCode(employeeId: string) {
    set({ isRevoking: true, revokingId: employeeId, error: null });

    try {
      await qrcodeService.revokeQRCode(employeeId);

      // Refetch the list to get updated data
      const state = get();
      await state.fetchQRCodes(state.page, state.limit);

      set({ isRevoking: false, revokingId: null });
    } catch (error) {
      const message = getQRCodeError(error);

      set({
        isRevoking: false,
        revokingId: null,
        error: message,
      });

      throw new Error(message);
    }
  },

  clearError() {
    set({ error: null });
  },
}));
