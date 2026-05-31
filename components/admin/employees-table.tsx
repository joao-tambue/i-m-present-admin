'use client';

import { Eye } from 'lucide-react';
import { useState } from 'react';
import { EmployeeModal } from './employee-modal';
import {
  Employee,
  employeeAreaLabels,
} from '@/services/employee-service';

interface EmployeesTableProps {
  employees: Employee[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function EmployeesTable({
  employees,
  isLoading,
  onRefresh,
}: EmployeesTableProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleView = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Nome
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Email
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Telefone
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Área
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-600">
                    Carregando funcionários...
                  </td>
                </tr>
              )}

              {!isLoading && employees.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-600">
                    Nenhum funcionário encontrado.
                  </td>
                </tr>
              )}

              {employees.map((employee) => (
                <tr
                  key={employee.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {employee.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{employee.email}</td>
                  <td className="px-6 py-4 text-gray-600">{employee.phone}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {employeeAreaLabels[employee.area]}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        employee.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {employee.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(employee)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Visualizar"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EmployeeModal
        isOpen={isModalOpen}
        employee={selectedEmployee}
        onClose={handleModalClose}
        onSaved={onRefresh}
      />
    </>
  );
}
