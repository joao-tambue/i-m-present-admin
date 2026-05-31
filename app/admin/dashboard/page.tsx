'use client';

import { useEffect } from 'react';
import { Header } from '@/components/admin/header';
import { StatCard } from '@/components/admin/stat-card';
import { AttendanceTable } from '@/components/admin/attendance-table';
import { useCoordinator } from '@/hooks/use-coordinator';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  XCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const {
    fetchStats,
    fetchSummary,
    fetchTodayAttendance,
    isLoadingAttendance,
    stats,
    summary,
    todayAttendance,
    updateAttendanceNote,
  } = useCoordinator();

  useEffect(() => {
    fetchStats();
    fetchSummary();
    fetchTodayAttendance();
  }, [fetchStats, fetchSummary, fetchTodayAttendance]);

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <Header
        title="Dashboard"
        description="Bem-vindo ao seu painel de controle"
      />

      <main className="flex-1 p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Total de Funcionários"
            value={stats?.totalEmployees ?? 0}
            icon={<Users className="w-6 h-6" />}
            textColor="text-purple-600"
            iconBgColor="bg-purple-100"
            trend="stable"
          />
          <StatCard
            label="Funcionários Ativos"
            value={stats?.activeEmployees ?? 0}
            icon={<CheckCircle className="w-6 h-6" />}
            textColor="text-green-600"
            iconBgColor="bg-green-100"
            trend="up"
          />
          <StatCard
            label="Presentes Hoje"
            value={(summary?.present ?? 0) + (summary?.late ?? 0)}
            icon={<Clock className="w-6 h-6" />}
            textColor="text-blue-600"
            iconBgColor="bg-blue-100"
            trend="up"
          />
          <StatCard
            label="Taxa de Presença"
            value={`${summary?.attendanceRate ?? 0}%`}
            icon={<TrendingUp className="w-6 h-6" />}
            textColor="text-emerald-600"
            iconBgColor="bg-emerald-100"
            trend="stable"
          />
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Presenças de Hoje
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Registos de presença do dia atual
            </p>
          </div>
          <AttendanceTable
            attendance={todayAttendance}
            isLoading={isLoadingAttendance}
            onSaveNote={updateAttendanceNote}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Presentes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {summary?.present ?? 0}
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
                  {summary?.late ?? 0}
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
                  {summary?.absent ?? 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
