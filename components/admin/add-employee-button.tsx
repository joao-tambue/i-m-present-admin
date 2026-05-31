'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Employee } from '@/lib/mock-data';
import { EmployeeModal } from './employee-modal';

interface AddEmployeeButtonProps {
  onAdd?: (employee: Employee) => void;
}

export function AddEmployeeButton({ onAdd }: AddEmployeeButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:shadow-lg transition-all"
      >
        <Plus className="w-4 h-4" />
        Novo Funcionário
      </button>

      <EmployeeModal
        isOpen={isModalOpen}
        employee={null}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
