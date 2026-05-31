'use client';

import { Header } from '@/components/admin/header';
import { StatCard } from '@/components/admin/stat-card';
import { AttendanceTable } from '@/components/admin/attendance-table';
import { getEmployeeStats, mockAttendance, mockEmployees } from '@/lib/mock-data';
import {
  Users,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  XCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const stats = getEmployeeStats();
  const todayAttendance = mockAttendance.filter((a) => a.date === '2026-05-31');

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <Header
        title="Dashboard"
        description="Bem-vindo ao seu painel de controle"
      />

      <main className="flex-1 p-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Total de Funcionários"
            value={stats.totalEmployees}
            icon={<Users className="w-6 h-6" />}
            backgroundColor="bg-white"
            textColor="text-purple-600"
            iconBgColor="bg-purple-100"
            trend="stable"
          />
          <StatCard
            label="Funcionários Ativos"
            value={stats.activeEmployees}
            icon={<CheckCircle className="w-6 h-6" />}
            backgroundColor="bg-white"
            textColor="text-green-600"
            iconBgColor="bg-green-100"
            trend="up"
          />
          <StatCard
            label="Presentes Hoje"
            value={stats.presentToday}
            icon={<Clock className="w-6 h-6" />}
            backgroundColor="bg-white"
            textColor="text-blue-600"
            iconBgColor="bg-blue-100"
            trend="up"
          />
          <StatCard
            label="Taxa de Presença"
            value={`${stats.attendanceRate}%`}
            icon={<TrendingUp className="w-6 h-6" />}
            backgroundColor="bg-white"
            textColor="text-emerald-600"
            iconBgColor="bg-emerald-100"
            trend="stable"
          />
        </div>

        {/* Today's Attendance */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Presenças de Hoje
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Status de presença para {new Date('2026-05-31').toLocaleDateString('pt-BR')}
            </p>
          </div>
          <AttendanceTable
            attendance={todayAttendance}
            employees={mockEmployees}
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Presentes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.presentToday}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Atrasados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.lateToday}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Ausentes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.absentToday}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
