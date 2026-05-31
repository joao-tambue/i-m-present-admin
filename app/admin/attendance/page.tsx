'use client';

import { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/admin/header';
import { AttendanceHistoryPanel } from '@/components/admin/attendance-history-panel';
import { AttendanceTable } from '@/components/admin/attendance-table';
import { ManualAttendanceForm } from '@/components/admin/manual-attendance-form';
import { useCoordinator } from '@/hooks/use-coordinator';
import { useEmployees } from '@/hooks/use-employees';
import { AttendanceStatus } from '@/services/coordinator-service';
import { Calendar, Filter } from 'lucide-react';

function getToday() {
  return new Date().toISOString().split('T')[0];
}

export default function AttendancePage() {
  const {
    fetchEmployees,
    employees,
  } = useEmployees();
  const {
    fetchSummary,
    fetchTodayAttendance,
    isLoadingAttendance,
    summary,
    todayAttendance,
    updateAttendanceNote,
  } = useCoordinator();
  const [dateFilter, setDateFilter] = useState(getToday());
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | 'all'>(
    'all',
  );

  useEffect(() => {
    fetchEmployees({ limit: 100, isActive: true });
  }, [fetchEmployees]);

  useEffect(() => {
    fetchSummary(dateFilter);
    fetchTodayAttendance();
  }, [dateFilter, fetchSummary, fetchTodayAttendance]);

  const filteredAttendance = useMemo(() => {
    if (statusFilter === 'all') return todayAttendance;
    return todayAttendance.filter((record) => record.status === statusFilter);
  }, [statusFilter, todayAttendance]);

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <Header
        title="Controle de Presenças"
        description="Acompanhe as presenças e faltas dos funcionários"
      />

      <main className="flex-1 p-8 space-y-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as AttendanceStatus | 'all')
              }
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              <option value="all">Todos os Status</option>
              <option value="PRESENT">Presente</option>
              <option value="LATE">Atrasado</option>
              <option value="ABSENT">Ausente</option>
              <option value="INCOMPLETE">Incompleto</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-600 font-medium uppercase">Total</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {summary?.total ?? 0}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-600 font-medium uppercase">Presente</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {summary?.present ?? 0}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-600 font-medium uppercase">Atrasado</p>
            <p className="text-2xl font-bold text-yellow-600 mt-2">
              {summary?.late ?? 0}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-600 font-medium uppercase">Ausente</p>
            <p className="text-2xl font-bold text-red-600 mt-2">
              {summary?.absent ?? 0}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-600 font-medium uppercase">Incompleto</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {summary?.incomplete ?? 0}
            </p>
          </div>
        </div>

        <ManualAttendanceForm
          employees={employees}
          selectedDate={dateFilter}
          onSaved={() => {
            fetchSummary(dateFilter);
            fetchTodayAttendance();
          }}
        />

        <AttendanceTable
          attendance={filteredAttendance}
          isLoading={isLoadingAttendance}
          onSaveNote={updateAttendanceNote}
        />

        <AttendanceHistoryPanel employees={employees} />
      </main>
    </div>
  );
}
