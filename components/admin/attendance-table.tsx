'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle, Edit3, XCircle } from 'lucide-react';
import {
  AttendanceRecord,
  AttendanceStatus,
} from '@/services/coordinator-service';

interface AttendanceTableProps {
  attendance: AttendanceRecord[];
  isLoading?: boolean;
  onSaveNote?: (recordId: string, notes: string) => Promise<void>;
}

const statusLabels: Record<AttendanceStatus, string> = {
  PRESENT: 'Presente',
  LATE: 'Atrasado',
  ABSENT: 'Ausente',
  INCOMPLETE: 'Incompleto',
};

function getStatusIcon(status: AttendanceStatus) {
  switch (status) {
    case 'PRESENT':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'LATE':
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    case 'ABSENT':
      return <XCircle className="h-5 w-5 text-red-500" />;
    case 'INCOMPLETE':
      return <AlertCircle className="h-5 w-5 text-blue-500" />;
  }
}

function getStatusColor(status: AttendanceStatus) {
  switch (status) {
    case 'PRESENT':
      return 'bg-green-100 text-green-800';
    case 'LATE':
      return 'bg-yellow-100 text-yellow-800';
    case 'ABSENT':
      return 'bg-red-100 text-red-800';
    case 'INCOMPLETE':
      return 'bg-blue-100 text-blue-800';
  }
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('pt-BR');
}

function formatTime(value: string | null) {
  if (!value) return '-';
  return new Date(value).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function AttendanceTable({
  attendance,
  isLoading,
  onSaveNote,
}: AttendanceTableProps) {
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const startEditing = (record: AttendanceRecord) => {
    setEditingRecordId(record.id);
    setNote(record.notes ?? '');
  };

  const saveNote = async () => {
    if (!editingRecordId || !onSaveNote) return;

    await onSaveNote(editingRecordId, note);
    setEditingRecordId(null);
    setNote('');
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
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
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                Notas
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-600">
                  Carregando presenças...
                </td>
              </tr>
            )}

            {!isLoading && attendance.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-600">
                  Nenhum registo encontrado.
                </td>
              </tr>
            )}

            {attendance.map((record) => (
              <tr key={record.id} className="transition-colors hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {record.employee?.name ?? record.employeeId ?? 'Funcionário'}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {formatDate(record.date)}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {formatTime(record.checkInAt)}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {formatTime(record.checkOutAt)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(record.status)}
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                        record.status,
                      )}`}
                    >
                      {statusLabels[record.status]}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {editingRecordId === record.id ? (
                    <div className="flex min-w-72 items-center gap-2">
                      <input
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        type="button"
                        onClick={saveNote}
                        className="rounded-lg bg-purple-600 px-3 py-2 font-medium text-white"
                      >
                        Guardar
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="max-w-72 truncate">
                        {record.notes || '-'}
                      </span>
                      {onSaveNote && (
                        <button
                          type="button"
                          onClick={() => startEditing(record)}
                          className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100"
                          title="Editar nota"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
