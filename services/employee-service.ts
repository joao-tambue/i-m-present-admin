import { AxiosError } from 'axios';
import { api } from '@/lib/api';

export type EmployeeArea =
  | 'DEV_FULLSTACK'
  | 'AI_ENGINEER'
  | 'FRONTEND_ENGINEER'
  | 'BACKEND_ENGINEER'
  | 'DEVOPS'
  | 'INFRASTRUCTURE'
  | 'OTHER';

export type Employee = {
  id: string;
  name: string;
  email: string;
  phone: string;
  area: EmployeeArea;
  isActive: boolean;
  createdAt: string;
};

export type WorkSchedule = {
  id: string;
  expectedCheckIn: string;
  expectedCheckOut: string;
  lateToleranceMinutes: number;
};

export type EmployeeQRCode = {
  id: string;
  status: string;
  issuedAt: string;
  revokedAt: string | null;
};

export type EmployeeDetail = Employee & {
  role: 'EMPLOYEE';
  schedule: WorkSchedule | null;
  qrCode: EmployeeQRCode | null;
};

export type EmployeeFilters = {
  area?: EmployeeArea;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
};

export type CreateEmployeePayload = {
  name: string;
  email: string;
  phone: string;
  area: EmployeeArea;
  password: string;
};

export type UpdateEmployeePayload = {
  name?: string;
  phone?: string;
  area?: EmployeeArea;
};

export type UpsertSchedulePayload = {
  expectedCheckIn: string;
  expectedCheckOut: string;
  lateToleranceMinutes?: number;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  error?: string;
};

type PaginatedEmployees = {
  data: Employee[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

type CreateEmployeeResponse = {
  token: string;
  user: Omit<Employee, 'isActive'> & {
    role: 'EMPLOYEE';
  };
};

export const employeeAreas = [
  'DEV_FULLSTACK',
  'AI_ENGINEER',
  'FRONTEND_ENGINEER',
  'BACKEND_ENGINEER',
  'DEVOPS',
  'INFRASTRUCTURE',
  'OTHER',
] as const;

export const employeeAreaLabels: Record<EmployeeArea, string> = {
  DEV_FULLSTACK: 'Dev Fullstack',
  AI_ENGINEER: 'AI Engineer',
  FRONTEND_ENGINEER: 'Frontend Engineer',
  BACKEND_ENGINEER: 'Backend Engineer',
  DEVOPS: 'DevOps',
  INFRASTRUCTURE: 'Infraestrutura',
  OTHER: 'Outro',
};

export function getEmployeeError(error: unknown) {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message;
    if (typeof message === 'string') return message;

    const validationError = error.response?.data?.error;
    if (typeof validationError === 'string') return validationError;
  }

  if (error instanceof Error) return error.message;

  return 'Não foi possível processar o pedido.';
}

export const employeeService = {
  async list(filters: EmployeeFilters = {}) {
    const { data } = await api.get<ApiResponse<PaginatedEmployees>>(
      '/coordinator/employees',
      {
        params: filters,
      },
    );

    return data.data;
  },

  async create(payload: CreateEmployeePayload) {
    const { data } = await api.post<ApiResponse<CreateEmployeeResponse>>(
      '/auth/register/employee',
      payload,
    );

    return data.data.user;
  },

  async getById(id: string) {
    const { data } = await api.get<ApiResponse<EmployeeDetail>>(
      `/coordinator/employees/${id}`,
    );

    return data.data;
  },

  async update(id: string, payload: UpdateEmployeePayload) {
    const { data } = await api.patch<ApiResponse<Employee>>(
      `/coordinator/employees/${id}`,
      payload,
    );

    return data.data;
  },

  async activate(id: string) {
    await api.patch<ApiResponse<null>>(`/coordinator/employees/${id}/activate`);
  },

  async deactivate(id: string) {
    await api.patch<ApiResponse<null>>(
      `/coordinator/employees/${id}/deactivate`,
    );
  },

  async upsertSchedule(id: string, payload: UpsertSchedulePayload) {
    const { data } = await api.put<ApiResponse<WorkSchedule>>(
      `/coordinator/employees/${id}/schedule`,
      payload,
    );

    return data.data;
  },

  async deleteSchedule(id: string) {
    await api.delete<ApiResponse<null>>(`/coordinator/employees/${id}/schedule`);
  },
};
