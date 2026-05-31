'use client';

import { useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  CreateEmployeePayload,
  EmployeeFilters,
  UpdateEmployeePayload,
  UpsertSchedulePayload,
} from '@/services/employee-service';
import { useEmployeeStore } from '@/stores/employee-store';

export function useEmployees() {
  const employees = useEmployeeStore((state) => state.employees);
  const selectedEmployee = useEmployeeStore((state) => state.selectedEmployee);
  const total = useEmployeeStore((state) => state.total);
  const page = useEmployeeStore((state) => state.page);
  const limit = useEmployeeStore((state) => state.limit);
  const totalPages = useEmployeeStore((state) => state.totalPages);
  const isLoading = useEmployeeStore((state) => state.isLoading);
  const isCreating = useEmployeeStore((state) => state.isCreating);
  const isSaving = useEmployeeStore((state) => state.isSaving);
  const isLoadingDetail = useEmployeeStore((state) => state.isLoadingDetail);
  const error = useEmployeeStore((state) => state.error);
  const storeFetchEmployees = useEmployeeStore((state) => state.fetchEmployees);
  const storeCreateEmployee = useEmployeeStore((state) => state.createEmployee);
  const storeFetchEmployeeDetail = useEmployeeStore(
    (state) => state.fetchEmployeeDetail,
  );
  const storeUpdateEmployee = useEmployeeStore((state) => state.updateEmployee);
  const storeActivateEmployee = useEmployeeStore(
    (state) => state.activateEmployee,
  );
  const storeDeactivateEmployee = useEmployeeStore(
    (state) => state.deactivateEmployee,
  );
  const storeUpsertSchedule = useEmployeeStore((state) => state.upsertSchedule);
  const storeDeleteSchedule = useEmployeeStore((state) => state.deleteSchedule);
  const clearSelectedEmployee = useEmployeeStore(
    (state) => state.clearSelectedEmployee,
  );
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

  const fetchEmployeeDetail = useCallback(
    async (id: string) => {
      try {
        await storeFetchEmployeeDetail(id);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar o funcionário.',
        );
      }
    },
    [storeFetchEmployeeDetail],
  );

  const updateEmployee = useCallback(
    async (id: string, payload: UpdateEmployeePayload) => {
      try {
        await storeUpdateEmployee(id, payload);
        toast.success('Funcionário atualizado com sucesso.');
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Não foi possível atualizar funcionário.',
        );
        throw error;
      }
    },
    [storeUpdateEmployee],
  );

  const setEmployeeActive = useCallback(
    async (id: string, isActive: boolean) => {
      try {
        if (isActive) {
          await storeActivateEmployee(id);
          toast.success('Funcionário ativado.');
        } else {
          await storeDeactivateEmployee(id);
          toast.success('Funcionário desativado.');
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Não foi possível alterar o estado do funcionário.',
        );
        throw error;
      }
    },
    [storeActivateEmployee, storeDeactivateEmployee],
  );

  const upsertSchedule = useCallback(
    async (id: string, payload: UpsertSchedulePayload) => {
      try {
        await storeUpsertSchedule(id, payload);
        toast.success('Horário guardado.');
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Não foi possível guardar o horário.',
        );
        throw error;
      }
    },
    [storeUpsertSchedule],
  );

  const deleteSchedule = useCallback(
    async (id: string) => {
      try {
        await storeDeleteSchedule(id);
        toast.success('Horário removido.');
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Não foi possível remover o horário.',
        );
        throw error;
      }
    },
    [storeDeleteSchedule],
  );

  return {
    employees,
    selectedEmployee,
    total,
    page,
    limit,
    totalPages,
    isLoading,
    isCreating,
    isSaving,
    isLoadingDetail,
    error,
    fetchEmployees,
    createEmployee,
    fetchEmployeeDetail,
    updateEmployee,
    setEmployeeActive,
    upsertSchedule,
    deleteSchedule,
    clearSelectedEmployee,
    clearError,
  };
}
