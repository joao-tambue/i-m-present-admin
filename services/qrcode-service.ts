import { AxiosError } from 'axios';
import { api } from '@/lib/api';

export type QRCodeStatus = 'ACTIVE' | 'REVOKED';

export type EmployeeQRCode = {
  id: string;
  code: string;
  status: QRCodeStatus;
  issuedAt: string;
  revokedAt: string | null;
};

export type QRCodeWithEmployee = {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  code: string;
  status: QRCodeStatus;
  issuedAt: string;
  revokedAt: string | null;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  error?: string;
};

type PaginatedQRCodes = {
  data: QRCodeWithEmployee[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

type RegenerateQRCodeResponse = {
  qrCode: EmployeeQRCode;
  imageDataUrl: string;
  svg: string;
};

export function getQRCodeError(error: unknown) {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message;
    if (typeof message === 'string') return message;

    const validationError = error.response?.data?.error;
    if (typeof validationError === 'string') return validationError;
  }

  if (error instanceof Error) return error.message;

  return 'Não foi possível processar o pedido de QR Code.';
}

export const qrcodeService = {
  async listQRCodes(page: number = 1, limit: number = 20, search?: string) {
    const { data } = await api.get<ApiResponse<PaginatedQRCodes>>(
      '/qr-code/list',
      {
        params: {
          page,
          limit,
          search,
        },
      },
    );

    return data.data;
  },

  async getEmployeeQRCode(employeeId: string) {
    const { data } = await api.get<ApiResponse<EmployeeQRCode>>(
      `/qr-code/employees/${employeeId}`,
    );

    return data.data;
  },

  async regenerateQRCode(employeeId: string) {
    const { data } = await api.post<ApiResponse<RegenerateQRCodeResponse>>(
      `/qr-code/employees/${employeeId}/regenerate`,
    );

    return data.data;
  },

  async revokeQRCode(employeeId: string) {
    const { data } = await api.patch<ApiResponse<EmployeeQRCode>>(
      `/qr-code/employees/${employeeId}/revoke`,
    );

    return data.data;
  },
};
