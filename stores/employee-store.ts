'use client';

import { create } from 'zustand';
import {
  CreateEmployeePayload,
  Employee,
  EmployeeDetail,
  EmployeeFilters,
  UpdateEmployeePayload,
  UpsertSchedulePayload,
  employeeService,
  getEmployeeError,
} from '@/services/employee-service';

type EmployeeState = {
  employees: Employee[];
  selectedEmployee: EmployeeDetail | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading: boolean;
  isCreating: boolean;
  isSaving: boolean;
  isLoadingDetail: boolean;
  error: string | null;
  fetchEmployees: (filters?: EmployeeFilters) => Promise<void>;
  createEmployee: (payload: CreateEmployeePayload) => Promise<void>;
  fetchEmployeeDetail: (id: string) => Promise<void>;
  updateEmployee: (id: string, payload: UpdateEmployeePayload) => Promise<void>;
  activateEmployee: (id: string) => Promise<void>;
  deactivateEmployee: (id: string) => Promise<void>;
  upsertSchedule: (id: string, payload: UpsertSchedulePayload) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
  clearSelectedEmployee: () => void;
  clearError: () => void;
};

export const useEmployeeStore = create<EmployeeState>((set) => ({
  employees: [],
  selectedEmployee: null,
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 1,
  isLoading: false,
  isCreating: false,
  isSaving: false,
  isLoadingDetail: false,
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

  async fetchEmployeeDetail(id) {
    set({ isLoadingDetail: true, error: null });

    try {
      const employee = await employeeService.getById(id);
      set({ selectedEmployee: employee, isLoadingDetail: false });
    } catch (error) {
      const message = getEmployeeError(error);
      set({ selectedEmployee: null, isLoadingDetail: false, error: message });
      throw new Error(message);
    }
  },

  async updateEmployee(id, payload) {
    set({ isSaving: true, error: null });

    try {
      await employeeService.update(id, payload);
      const employee = await employeeService.getById(id);
      set((state) => ({
        employees: state.employees.map((item) =>
          item.id === id
            ? {
                ...item,
                name: employee.name,
                phone: employee.phone,
                area: employee.area,
              }
            : item,
        ),
        selectedEmployee: employee,
        isSaving: false,
      }));
    } catch (error) {
      const message = getEmployeeError(error);
      set({ isSaving: false, error: message });
      throw new Error(message);
    }
  },

  async activateEmployee(id) {
    set({ isSaving: true, error: null });

    try {
      await employeeService.activate(id);
      set((state) => ({
        employees: state.employees.map((employee) =>
          employee.id === id ? { ...employee, isActive: true } : employee,
        ),
        selectedEmployee: state.selectedEmployee?.id === id
          ? { ...state.selectedEmployee, isActive: true }
          : state.selectedEmployee,
        isSaving: false,
      }));
    } catch (error) {
      const message = getEmployeeError(error);
      set({ isSaving: false, error: message });
      throw new Error(message);
    }
  },

  async deactivateEmployee(id) {
    set({ isSaving: true, error: null });

    try {
      await employeeService.deactivate(id);
      set((state) => ({
        employees: state.employees.map((employee) =>
          employee.id === id ? { ...employee, isActive: false } : employee,
        ),
        selectedEmployee: state.selectedEmployee?.id === id
          ? { ...state.selectedEmployee, isActive: false }
          : state.selectedEmployee,
        isSaving: false,
      }));
    } catch (error) {
      const message = getEmployeeError(error);
      set({ isSaving: false, error: message });
      throw new Error(message);
    }
  },

  async upsertSchedule(id, payload) {
    set({ isSaving: true, error: null });

    try {
      const schedule = await employeeService.upsertSchedule(id, payload);
      set((state) => ({
        selectedEmployee: state.selectedEmployee
          ? { ...state.selectedEmployee, schedule }
          : state.selectedEmployee,
        isSaving: false,
      }));
    } catch (error) {
      const message = getEmployeeError(error);
      set({ isSaving: false, error: message });
      throw new Error(message);
    }
  },

  async deleteSchedule(id) {
    set({ isSaving: true, error: null });

    try {
      await employeeService.deleteSchedule(id);
      set((state) => ({
        selectedEmployee: state.selectedEmployee
          ? { ...state.selectedEmployee, schedule: null }
          : state.selectedEmployee,
        isSaving: false,
      }));
    } catch (error) {
      const message = getEmployeeError(error);
      set({ isSaving: false, error: message });
      throw new Error(message);
    }
  },

  clearSelectedEmployee() {
    set({ selectedEmployee: null });
  },

  clearError() {
    set({ error: null });
  },
}));
