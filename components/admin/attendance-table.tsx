'use client';

import { Attendance, Employee } from '@/lib/mock-data';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface AttendanceTableProps {
  attendance: Attendance[];
  employees: Employee[];
}

export function AttendanceTable({
  attendance,
  employees,
}: AttendanceTableProps) {
  const getEmployeeName = (employeeId: string) => {
    return employees.find((e) => e.id === employeeId)?.name || 'Unknown';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'late':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'absent':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'half-day':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present':
        return 'Presente';
      case 'late':
        return 'Atrasado';
      case 'absent':
        return 'Ausente';
      case 'half-day':
        return 'Meio Período';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'half-day':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Funcionário
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Data
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Entrada
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Saída
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {attendance.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {getEmployeeName(record.employeeId)}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(record.date).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {record.checkInTime || '—'}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {record.checkOutTime || '—'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(record.status)}
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        record.status
                      )}`}
                    >
                      {getStatusLabel(record.status)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
