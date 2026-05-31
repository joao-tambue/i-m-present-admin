'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCoordinator } from '@/hooks/use-coordinator';
import { Employee } from '@/services/employee-service';

const manualAttendanceSchema = z.object({
  employeeId: z.string().min(1, 'Selecione um funcionário.'),
  date: z.string().min(1, 'Selecione uma data.'),
  checkInAt: z.string().optional(),
  checkOutAt: z.string().optional(),
  notes: z.string().optional(),
});

type ManualAttendanceFormData = z.infer<typeof manualAttendanceSchema>;

type ManualAttendanceFormProps = {
  employees: Employee[];
  selectedDate: string;
  onSaved?: () => void;
};

export function ManualAttendanceForm({
  employees,
  selectedDate,
  onSaved,
}: ManualAttendanceFormProps) {
  const { createManualAttendance, isSavingAttendance } = useCoordinator();
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<ManualAttendanceFormData>({
    resolver: zodResolver(manualAttendanceSchema),
    defaultValues: {
      employeeId: '',
      date: selectedDate,
      checkInAt: '',
      checkOutAt: '',
      notes: '',
    },
  });

  const onSubmit = async (data: ManualAttendanceFormData) => {
    await createManualAttendance({
      employeeId: data.employeeId,
      date: data.date,
      checkInAt: data.checkInAt || undefined,
      checkOutAt: data.checkOutAt || undefined,
      notes: data.notes || undefined,
    });
    reset({
      employeeId: '',
      date: data.date,
      checkInAt: '',
      checkOutAt: '',
      notes: '',
    });
    onSaved?.();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-bold text-gray-900">Registo Manual</h2>
        <p className="mt-1 text-sm text-gray-600">
          Crie ou corrija uma presença para qualquer funcionário.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Funcionário
          </label>
          <select
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
            {...register('employeeId')}
          >
            <option value="">Selecionar</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
          {errors.employeeId && (
            <p className="mt-1 text-sm text-red-600">
              {errors.employeeId.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Data
          </label>
          <input
            type="date"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
            {...register('date')}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Entrada
          </label>
          <input
            type="time"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
            {...register('checkInAt')}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Saída
          </label>
          <input
            type="time"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
            {...register('checkOutAt')}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <input
          placeholder="Nota opcional"
          className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
          {...register('notes')}
        />
        <button
          type="submit"
          disabled={isSavingAttendance}
          className="rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 px-5 py-2.5 font-medium text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSavingAttendance ? 'Guardando...' : 'Guardar Presença'}
        </button>
      </div>
    </form>
  );
}
