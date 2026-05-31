'use client';

import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { ManualAttendancePayload } from '@/services/coordinator-service';
import { useCoordinatorStore } from '@/stores/coordinator-store';

function notifyError(error: unknown, fallback: string) {
  toast.error(error instanceof Error ? error.message : fallback);
}

export function useCoordinator() {
  const stats = useCoordinatorStore((state) => state.stats);
  const summary = useCoordinatorStore((state) => state.summary);
  const todayAttendance = useCoordinatorStore((state) => state.todayAttendance);
  const employeeHistory = useCoordinatorStore((state) => state.employeeHistory);
  const isLoadingStats = useCoordinatorStore((state) => state.isLoadingStats);
  const isLoadingAttendance = useCoordinatorStore(
    (state) => state.isLoadingAttendance,
  );
  const isSavingAttendance = useCoordinatorStore(
    (state) => state.isSavingAttendance,
  );
  const error = useCoordinatorStore((state) => state.error);
  const storeFetchStats = useCoordinatorStore((state) => state.fetchStats);
  const storeFetchSummary = useCoordinatorStore((state) => state.fetchSummary);
  const storeFetchTodayAttendance = useCoordinatorStore(
    (state) => state.fetchTodayAttendance,
  );
  const storeFetchEmployeeHistory = useCoordinatorStore(
    (state) => state.fetchEmployeeHistory,
  );
  const storeCreateManualAttendance = useCoordinatorStore(
    (state) => state.createManualAttendance,
  );
  const storeUpdateAttendanceNote = useCoordinatorStore(
    (state) => state.updateAttendanceNote,
  );
  const clearHistory = useCoordinatorStore((state) => state.clearHistory);
  const clearError = useCoordinatorStore((state) => state.clearError);

  const fetchStats = useCallback(async () => {
    try {
      await storeFetchStats();
    } catch (error) {
      notifyError(error, 'Não foi possível carregar estatísticas.');
    }
  }, [storeFetchStats]);

  const fetchSummary = useCallback(
    async (date?: string) => {
      try {
        await storeFetchSummary(date);
      } catch (error) {
        notifyError(error, 'Não foi possível carregar o resumo.');
      }
    },
    [storeFetchSummary],
  );

  const fetchTodayAttendance = useCallback(async () => {
    try {
      await storeFetchTodayAttendance();
    } catch (error) {
      notifyError(error, 'Não foi possível carregar presenças.');
    }
  }, [storeFetchTodayAttendance]);

  const fetchEmployeeHistory = useCallback(
    async (employeeId: string, from: string, to: string) => {
      try {
        await storeFetchEmployeeHistory(employeeId, from, to);
      } catch (error) {
        notifyError(error, 'Não foi possível carregar histórico.');
      }
    },
    [storeFetchEmployeeHistory],
  );

  const createManualAttendance = useCallback(
    async (payload: ManualAttendancePayload) => {
      try {
        await storeCreateManualAttendance(payload);
        toast.success('Presença registada.');
      } catch (error) {
        notifyError(error, 'Não foi possível registar presença.');
        throw error;
      }
    },
    [storeCreateManualAttendance],
  );

  const updateAttendanceNote = useCallback(
    async (recordId: string, notes: string) => {
      try {
        await storeUpdateAttendanceNote(recordId, notes);
        toast.success('Nota guardada.');
      } catch (error) {
        notifyError(error, 'Não foi possível guardar nota.');
        throw error;
      }
    },
    [storeUpdateAttendanceNote],
  );

  return {
    stats,
    summary,
    todayAttendance,
    employeeHistory,
    isLoadingStats,
    isLoadingAttendance,
    isSavingAttendance,
    error,
    fetchStats,
    fetchSummary,
    fetchTodayAttendance,
    fetchEmployeeHistory,
    createManualAttendance,
    updateAttendanceNote,
    clearHistory,
    clearError,
  };
}
