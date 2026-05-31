'use client';

import { Header } from '@/components/admin/header';
import { mockAttendance, mockEmployees } from '@/lib/mock-data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, FileText } from 'lucide-react';

export default function ReportsPage() {
  // Prepare data for attendance by status
  const statusCounts = {
    present: mockAttendance.filter((a) => a.status === 'present').length,
    late: mockAttendance.filter((a) => a.status === 'late').length,
    absent: mockAttendance.filter((a) => a.status === 'absent').length,
    halfDay: mockAttendance.filter((a) => a.status === 'half-day').length,
  };

  const pieData = [
    { name: 'Presente', value: statusCounts.present, color: '#10b981' },
    { name: 'Atrasado', value: statusCounts.late, color: '#f59e0b' },
    { name: 'Ausente', value: statusCounts.absent, color: '#ef4444' },
    { name: 'Meio Período', value: statusCounts.halfDay, color: '#3b82f6' },
  ];

  // Prepare data for attendance by department
  const departmentStats = mockEmployees.reduce((acc, emp) => {
    const dept = acc.find((d) => d.name === emp.department);
    if (dept) {
      dept.total += 1;
      dept.active += emp.status === 'active' ? 1 : 0;
    } else {
      acc.push({
        name: emp.department,
        total: 1,
        active: emp.status === 'active' ? 1 : 0,
      });
    }
    return acc;
  }, [] as Array<{ name: string; total: number; active: number }>);

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <Header
        title="Relatórios"
        description="Análise detalhada de presenças e estatísticas"
      />

      <main className="flex-1 p-8 space-y-8">
        {/* Report Actions */}
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Status Pie Chart */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Distribuição de Presenças
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
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Department Stats Bar Chart */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Funcionários por Departamento
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#9333ea" name="Total" />
                <Bar dataKey="active" fill="#10b981" name="Ativos" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 font-medium">Total de Registros</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {mockAttendance.length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 font-medium">Taxa Presença</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {Math.round((statusCounts.present / mockAttendance.length) * 100)}%
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 font-medium">Taxa Atraso</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {Math.round((statusCounts.late / mockAttendance.length) * 100)}%
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 font-medium">Taxa Ausência</p>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {Math.round((statusCounts.absent / mockAttendance.length) * 100)}%
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
