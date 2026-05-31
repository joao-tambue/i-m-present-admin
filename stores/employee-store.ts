'use client';

import { create } from 'zustand';
import {
  CreateEmployeePayload,
  Employee,
  EmployeeFilters,
  employeeService,
  getEmployeeError,
} from '@/services/employee-service';

type EmployeeState = {
  employees: Employee[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  fetchEmployees: (filters?: EmployeeFilters) => Promise<void>;
  createEmployee: (payload: CreateEmployeePayload) => Promise<void>;
  clearError: () => void;
};

export const useEmployeeStore = create<EmployeeState>((set) => ({
  employees: [],
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 1,
  isLoading: false,
  isCreating: false,
  error: null,

  async fetchEmployees(filters = {}) {
    set({ isLoading: true, error: null });

    try {
      const result = await employeeService.list(filters);

      set({
        employees: result.data,
        total: result.meta.total,
        page: result.meta.page,
        limit: result.meta.limit,
        totalPages: result.meta.totalPages,
        isLoading: false,
      });
    } catch (error) {
      const message = getEmployeeError(error);

      set({
        employees: [],
        total: 0,
        isLoading: false,
        error: message,
      });

      throw new Error(message);
    }
  },

  async createEmployee(payload) {
    set({ isCreating: true, error: null });

    try {
      await employeeService.create(payload);
      set({ isCreating: false });
    } catch (error) {
      const message = getEmployeeError(error);

      set({
        isCreating: false,
        error: message,
      });

      throw new Error(message);
    }
  },

  clearError() {
    set({ error: null });
  },
}));
