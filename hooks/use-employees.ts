'use client';

import { useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  CreateEmployeePayload,
  EmployeeFilters,
} from '@/services/employee-service';
import { useEmployeeStore } from '@/stores/employee-store';

export function useEmployees() {
  const employees = useEmployeeStore((state) => state.employees);
  const total = useEmployeeStore((state) => state.total);
  const page = useEmployeeStore((state) => state.page);
  const limit = useEmployeeStore((state) => state.limit);
  const totalPages = useEmployeeStore((state) => state.totalPages);
  const isLoading = useEmployeeStore((state) => state.isLoading);
  const isCreating = useEmployeeStore((state) => state.isCreating);
  const error = useEmployeeStore((state) => state.error);
  const storeFetchEmployees = useEmployeeStore((state) => state.fetchEmployees);
  const storeCreateEmployee = useEmployeeStore((state) => state.createEmployee);
  const clearError = useEmployeeStore((state) => state.clearError);

  const fetchEmployees = useCallback(
    async (filters?: EmployeeFilters) => {
      try {
        await storeFetchEmployees(filters);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar funcionários.';
        toast.error(message);
      }
    },
    [storeFetchEmployees],
  );

  const createEmployee = useCallback(
    async (payload: CreateEmployeePayload) => {
      try {
        await storeCreateEmployee(payload);
        toast.success('Funcionário cadastrado com sucesso.');
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Não foi possível cadastrar funcionário.';
        toast.error(message);
        throw error;
      }
    },
    [storeCreateEmployee],
  );

  return {
    employees,
    total,
    page,
    limit,
    totalPages,
    isLoading,
    isCreating,
    error,
    fetchEmployees,
    createEmployee,
    clearError,
  };
}
