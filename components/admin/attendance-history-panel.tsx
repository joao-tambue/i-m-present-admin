'use client';

import { useState } from 'react';
import { AttendanceTable } from '@/components/admin/attendance-table';
import { useCoordinator } from '@/hooks/use-coordinator';
import { Employee } from '@/services/employee-service';

type AttendanceHistoryPanelProps = {
  employees: Employee[];
};

function getMonthStart() {
  const date = new Date();
  date.setDate(1);
  return date.toISOString().split('T')[0];
}

function getToday() {
  return new Date().toISOString().split('T')[0];
}

export function AttendanceHistoryPanel({
  employees,
}: AttendanceHistoryPanelProps) {
  const {
    employeeHistory,
    fetchEmployeeHistory,
    isLoadingAttendance,
    updateAttendanceNote,
  } = useCoordinator();
  const [employeeId, setEmployeeId] = useState('');
  const [from, setFrom] = useState(getMonthStart());
  const [to, setTo] = useState(getToday());

  const searchHistory = () => {
    if (!employeeId || !from || !to) return;
    fetchEmployeeHistory(employeeId, from, to);
  };

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-bold text-gray-900">
          Histórico por Funcionário
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Consulte presenças dentro de um intervalo de datas.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <select
          value={employeeId}
          onChange={(event) => setEmployeeId(event.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500 md:col-span-2"
        >
          <option value="">Selecionar funcionário</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={from}
          onChange={(event) => setFrom(event.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="date"
          value={to}
          onChange={(event) => setTo(event.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <button
        type="button"
        onClick={searchHistory}
        disabled={!employeeId}
        className="rounded-lg bg-purple-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Consultar Histórico
      </button>

      <AttendanceTable
        attendance={employeeHistory}
        isLoading={isLoadingAttendance}
        onSaveNote={updateAttendanceNote}
      />
    </div>
  );
}
