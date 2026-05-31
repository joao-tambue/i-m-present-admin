import { api } from '@/lib/api';

export type AuthRole = 'COORDINATOR' | 'EMPLOYEE';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: AuthRole;
  area?: string;
  createdAt?: string;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  error?: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
  user: AuthUser;
};

export const authService = {
  async login(payload: LoginPayload) {
    const { data } = await api.post<ApiResponse<LoginResponse>>(
      '/auth/login',
      payload,
    );

    return data.data;
  },

  async me() {
    const { data } = await api.get<ApiResponse<AuthUser>>('/auth/me');

    return data.data;
  },
};
