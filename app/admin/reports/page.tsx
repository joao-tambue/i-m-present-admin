'use client';

import { useEffect } from 'react';
import { Header } from '@/components/admin/header';
import { useCoordinator } from '@/hooks/use-coordinator';
import {
  employeeAreaLabels,
  EmployeeArea,
} from '@/services/employee-service';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Download, FileText } from 'lucide-react';

export default function ReportsPage() {
  const { fetchStats, fetchSummary, stats, summary } = useCoordinator();

  useEffect(() => {
    fetchStats();
    fetchSummary();
  }, [fetchStats, fetchSummary]);

  const pieData = [
    { name: 'Presente', value: summary?.present ?? 0, color: '#10b981' },
    { name: 'Atrasado', value: summary?.late ?? 0, color: '#f59e0b' },
    { name: 'Ausente', value: summary?.absent ?? 0, color: '#ef4444' },
    { name: 'Incompleto', value: summary?.incomplete ?? 0, color: '#3b82f6' },
  ];

  const areaData = Object.entries(stats?.byArea ?? {}).map(([area, total]) => ({
    name: employeeAreaLabels[area as EmployeeArea],
    total,
  }));

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <Header
        title="Relatórios"
        description="Análise detalhada de presenças e estatísticas"
      />

      <main className="flex-1 p-8 space-y-8">
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:shadow-lg transition-all">
            <FileText className="w-4 h-4" />
            Gerar Relatório PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Exportar Excel
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Distribuição de Presenças Hoje
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Funcionários Ativos por Área
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={areaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#9333ea" name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 font-medium">Funcionários</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats?.totalEmployees ?? 0}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 font-medium">Taxa Presença</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {summary?.attendanceRate ?? 0}%
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 font-medium">Atrasos Hoje</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {summary?.late ?? 0}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 font-medium">Ausências Hoje</p>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {summary?.absent ?? 0}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
