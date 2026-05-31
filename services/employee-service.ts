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
};
