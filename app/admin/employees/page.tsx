'use client';

import { Header } from '@/components/admin/header';
import { EmployeesTable } from '@/components/admin/employees-table';
import { AddEmployeeButton } from '@/components/admin/add-employee-button';
import { useEmployees } from '@/hooks/use-employees';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Download } from 'lucide-react';

export default function EmployeesPage() {
  const {
    employees,
    error,
    fetchEmployees,
    isLoading,
    total,
  } = useEmployees();
  const [searchTerm, setSearchTerm] = useState('');

  const activeEmployees = useMemo(
    () => employees.filter((employee) => employee.isActive).length,
    [employees],
  );

  const loadEmployees = useCallback(() => {
    fetchEmployees({
      search: searchTerm || undefined,
      page: 1,
      limit: 50,
    });
  }, [fetchEmployees, searchTerm]);

  useEffect(() => {
    const timeout = window.setTimeout(loadEmployees, 350);

    return () => window.clearTimeout(timeout);
  }, [loadEmployees]);

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <Header
        title="Funcionários"
        description="Gerenciar todos os funcionários da empresa"
      />

      <main className="flex-1 p-8 space-y-6">
        {/* Actions Bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-64">
            <input
              type="search"
              placeholder="Pesquisar funcionários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Exportar
            </button>
            <AddEmployeeButton onCreated={loadEmployees} />
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 font-medium">Total</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{total}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 font-medium">Ativos</p>
            <p className="text-3xl font-bold text-green-600 mt-1">
              {activeEmployees}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 font-medium">Inativos</p>
            <p className="text-3xl font-bold text-red-600 mt-1">
              {Math.max(total - activeEmployees, 0)}
            </p>
          </div>
        </div>

        {/* Employees Table */}
        <EmployeesTable
          employees={employees}
          isLoading={isLoading}
          onRefresh={loadEmployees}
        />
      </main>
    </div>
  );
}
