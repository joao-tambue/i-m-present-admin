import { AxiosError } from 'axios';
import { api } from '@/lib/api';
import { Employee, EmployeeArea } from '@/services/employee-service';

export type AttendanceStatus = 'PRESENT' | 'LATE' | 'ABSENT' | 'INCOMPLETE';

export type EmployeeStats = {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  byArea: Partial<Record<EmployeeArea, number>>;
};

export type DailyAttendanceSummary = {
  date: string;
  total: number;
  present: number;
  late: number;
  absent: number;
  incomplete: number;
  attendanceRate: number;
};

export type AttendanceRecord = {
  id: string;
  employeeId?: string;
  employee?: Pick<Employee, 'id' | 'name' | 'email' | 'phone' | 'area'>;
  date: string;
  checkInAt: string | null;
  checkOutAt: string | null;
  checkInMethod: string | null;
  checkOutMethod: string | null;
  status: AttendanceStatus;
  lateMinutes: number | null;
  workedMinutes: number | null;
  notes: string | null;
};

export type ManualAttendancePayload = {
  employeeId: string;
  date: string;
  checkInAt?: string;
  checkOutAt?: string;
  notes?: string;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  error?: string;
};

export function getCoordinatorError(error: unknown) {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message;
    if (typeof message === 'string') return message;

    const validationError = error.response?.data?.error;
    if (typeof validationError === 'string') return validationError;
  }

  if (error instanceof Error) return error.message;

  return 'Não foi possível processar o pedido.';
}

export const coordinatorService = {
  async getStats() {
    const { data } = await api.get<ApiResponse<EmployeeStats>>(
      '/coordinator/stats',
    );

    return data.data;
  },

  async getTodayAttendance() {
    const { data } = await api.get<ApiResponse<AttendanceRecord[]>>(
      '/coordinator/attendance/today',
    );

    return data.data;
  },

  async getAttendanceSummary(date?: string) {
    const { data } = await api.get<ApiResponse<DailyAttendanceSummary>>(
      '/coordinator/attendance/summary',
      {
        params: { date },
      },
    );

    return data.data;
  },

  async getEmployeeAttendance(employeeId: string, from: string, to: string) {
    const { data } = await api.get<ApiResponse<AttendanceRecord[]>>(
      `/coordinator/employees/${employeeId}/attendance`,
      {
        params: { from, to },
      },
    );

    return data.data;
  },

  async createManualAttendance(payload: ManualAttendancePayload) {
    const { data } = await api.post<ApiResponse<AttendanceRecord>>(
      '/coordinator/attendance/manual',
      payload,
    );

    return data.data;
  },

  async updateAttendanceNote(recordId: string, notes: string) {
    const { data } = await api.patch<ApiResponse<AttendanceRecord>>(
      `/coordinator/attendance/${recordId}/note`,
      { notes },
    );

    return data.data;
  },
};
