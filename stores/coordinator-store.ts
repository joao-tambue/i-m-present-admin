'use client';

import { create } from 'zustand';
import {
  AttendanceRecord,
  DailyAttendanceSummary,
  EmployeeStats,
  ManualAttendancePayload,
  coordinatorService,
  getCoordinatorError,
} from '@/services/coordinator-service';

type CoordinatorState = {
  stats: EmployeeStats | null;
  summary: DailyAttendanceSummary | null;
  todayAttendance: AttendanceRecord[];
  employeeHistory: AttendanceRecord[];
  isLoadingStats: boolean;
  isLoadingAttendance: boolean;
  isSavingAttendance: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
  fetchSummary: (date?: string) => Promise<void>;
  fetchTodayAttendance: () => Promise<void>;
  fetchEmployeeHistory: (
    employeeId: string,
    from: string,
    to: string,
  ) => Promise<void>;
  createManualAttendance: (payload: ManualAttendancePayload) => Promise<void>;
  updateAttendanceNote: (recordId: string, notes: string) => Promise<void>;
  clearHistory: () => void;
  clearError: () => void;
};

export const useCoordinatorStore = create<CoordinatorState>((set, get) => ({
  stats: null,
  summary: null,
  todayAttendance: [],
  employeeHistory: [],
  isLoadingStats: false,
  isLoadingAttendance: false,
  isSavingAttendance: false,
  error: null,

  async fetchStats() {
    set({ isLoadingStats: true, error: null });

    try {
      const stats = await coordinatorService.getStats();
      set({ stats, isLoadingStats: false });
    } catch (error) {
      const message = getCoordinatorError(error);
      set({ isLoadingStats: false, error: message });
      throw new Error(message);
    }
  },

  async fetchSummary(date) {
    set({ isLoadingStats: true, error: null });

    try {
      const summary = await coordinatorService.getAttendanceSummary(date);
      set({ summary, isLoadingStats: false });
    } catch (error) {
      const message = getCoordinatorError(error);
      set({ isLoadingStats: false, error: message });
      throw new Error(message);
    }
  },

  async fetchTodayAttendance() {
    set({ isLoadingAttendance: true, error: null });

    try {
      const todayAttendance = await coordinatorService.getTodayAttendance();
      set({ todayAttendance, isLoadingAttendance: false });
    } catch (error) {
      const message = getCoordinatorError(error);
      set({ isLoadingAttendance: false, error: message });
      throw new Error(message);
    }
  },

  async fetchEmployeeHistory(employeeId, from, to) {
    set({ isLoadingAttendance: true, error: null });

    try {
      const employeeHistory = await coordinatorService.getEmployeeAttendance(
        employeeId,
        from,
        to,
      );
      set({ employeeHistory, isLoadingAttendance: false });
    } catch (error) {
      const message = getCoordinatorError(error);
      set({ isLoadingAttendance: false, error: message });
      throw new Error(message);
    }
  },

  async createManualAttendance(payload) {
    set({ isSavingAttendance: true, error: null });

    try {
      await coordinatorService.createManualAttendance(payload);
      await Promise.all([
        get().fetchTodayAttendance(),
        get().fetchSummary(payload.date),
      ]);
      set({ isSavingAttendance: false });
    } catch (error) {
      const message = getCoordinatorError(error);
      set({ isSavingAttendance: false, error: message });
      throw new Error(message);
    }
  },

  async updateAttendanceNote(recordId, notes) {
    set({ isSavingAttendance: true, error: null });

    try {
      const updated = await coordinatorService.updateAttendanceNote(
        recordId,
        notes,
      );
      set((state) => ({
        todayAttendance: state.todayAttendance.map((record) =>
          record.id === recordId ? { ...record, notes: updated.notes } : record,
        ),
        employeeHistory: state.employeeHistory.map((record) =>
          record.id === recordId ? { ...record, notes: updated.notes } : record,
        ),
        isSavingAttendance: false,
      }));
    } catch (error) {
      const message = getCoordinatorError(error);
      set({ isSavingAttendance: false, error: message });
      throw new Error(message);
    }
  },

  clearHistory() {
    set({ employeeHistory: [] });
  },

  clearError() {
    set({ error: null });
  },
}));
