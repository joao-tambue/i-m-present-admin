'use client';

import { Header } from '@/components/admin/header';
import { AttendanceTable } from '@/components/admin/attendance-table';
import { mockAttendance, mockEmployees, Attendance } from '@/lib/mock-data';
import { useState } from 'react';
import { Calendar, Filter } from 'lucide-react';

export default function AttendancePage() {
  const [dateFilter, setDateFilter] = useState('2026-05-31');
  const [statusFilter, setStatusFilter] = useState('all');

  let filteredAttendance = mockAttendance.filter((a) => a.date === dateFilter);

  if (statusFilter !== 'all') {
    filteredAttendance = filteredAttendance.filter((a) => a.status === statusFilter);
  }

  const stats = {
    total: filteredAttendance.length,
    present: filteredAttendance.filter((a) => a.status === 'present').length,
    late: filteredAttendance.filter((a) => a.status === 'late').length,
    absent: filteredAttendance.filter((a) => a.status === 'absent').length,
    halfDay: filteredAttendance.filter((a) => a.status === 'half-day').length,
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <Header
        title="Controle de Presenças"
        description="Acompanhe as presenças e faltas dos funcionários"
      />

      <main className="flex-1 p-8 space-y-6">
        {/* Filters */}
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
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              <option value="all">Todos os Status</option>
              <option value="present">Presente</option>
              <option value="late">Atrasado</option>
              <option value="absent">Ausente</option>
              <option value="half-day">Meio Período</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-600 font-medium uppercase">Total</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-600 font-medium uppercase">Presente</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {stats.present}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-600 font-medium uppercase">Atrasado</p>
            <p className="text-2xl font-bold text-yellow-600 mt-2">
              {stats.late}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-600 font-medium uppercase">Ausente</p>
            <p className="text-2xl font-bold text-red-600 mt-2">{stats.absent}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-600 font-medium uppercase">Meio Período</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {stats.halfDay}
            </p>
          </div>
        </div>

        {/* Attendance Table */}
        <AttendanceTable
          attendance={filteredAttendance}
          employees={mockEmployees}
        />
      </main>
    </div>
  );
}
