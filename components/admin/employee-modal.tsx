'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEmployees } from '@/hooks/use-employees';
import {
  Employee,
  employeeAreaLabels,
  employeeAreas,
} from '@/services/employee-service';

interface EmployeeModalProps {
  isOpen: boolean;
  employee: Employee | null;
  onClose: () => void;
  onSaved?: () => void;
}

const employeeSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres.'),
  email: z.string().email('Informe um email válido.'),
  phone: z
    .string()
    .min(9, 'Número inválido.')
    .max(15, 'Número inválido.')
    .regex(/^\+?[\d\s\-()]+$/, 'Número de telefone inválido.'),
  area: z.enum(employeeAreas, {
    errorMap: () => ({ message: 'Selecione uma área.' }),
  }),
  password: z
    .string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres.')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula.')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número.'),
});

const scheduleSchema = z.object({
  expectedCheckIn: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:MM.'),
  expectedCheckOut: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:MM.'),
  lateToleranceMinutes: z.coerce.number().int().min(0, 'Use um valor positivo.'),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;
type ScheduleFormData = z.infer<typeof scheduleSchema>;

export function EmployeeModal({
  isOpen,
  employee,
  onClose,
  onSaved,
}: EmployeeModalProps) {
  const {
    clearError,
    clearSelectedEmployee,
    createEmployee,
    deleteSchedule,
    error,
    fetchEmployeeDetail,
    isCreating,
    isLoadingDetail,
    isSaving,
    selectedEmployee,
    setEmployeeActive,
    updateEmployee,
    upsertSchedule,
  } = useEmployees();
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(
      employee
        ? employeeSchema.omit({ email: true, password: true })
        : employeeSchema,
    ),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      area: 'DEV_FULLSTACK',
      password: '',
    },
  });
  const {
    formState: { errors: scheduleErrors },
    handleSubmit: handleScheduleSubmit,
    register: registerSchedule,
    reset: resetSchedule,
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      expectedCheckIn: '08:00',
      expectedCheckOut: '17:00',
      lateToleranceMinutes: 15,
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    clearError();
    clearSelectedEmployee();
    reset({
      name: employee?.name ?? '',
      email: employee?.email ?? '',
      phone: employee?.phone ?? '',
      area: employee?.area ?? 'DEV_FULLSTACK',
      password: '',
    });

    if (employee) {
      fetchEmployeeDetail(employee.id);
    }
  }, [clearError, clearSelectedEmployee, employee, fetchEmployeeDetail, isOpen, reset]);

  useEffect(() => {
    if (!selectedEmployee?.schedule) return;

    resetSchedule({
      expectedCheckIn: selectedEmployee.schedule.expectedCheckIn,
      expectedCheckOut: selectedEmployee.schedule.expectedCheckOut,
      lateToleranceMinutes: selectedEmployee.schedule.lateToleranceMinutes,
    });
  }, [resetSchedule, selectedEmployee]);

  if (!isOpen) return null;

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      if (employee) {
        await updateEmployee(employee.id, {
          name: data.name,
          phone: data.phone,
          area: data.area,
        });
      } else {
        await createEmployee(data);
      }
      onSaved?.();
      if (!employee) onClose();
    } catch {
      // Store and toast already expose the error.
    }
  };

  const onScheduleSubmit = async (data: ScheduleFormData) => {
    if (!employee) return;

    try {
      await upsertSchedule(employee.id, data);
      onSaved?.();
    } catch {
      // Store and toast already expose the error.
    }
  };

  const handleToggleActive = async () => {
    if (!employee || !selectedEmployee) return;

    try {
      await setEmployeeActive(employee.id, !selectedEmployee.isActive);
      onSaved?.();
    } catch {
      // Store and toast already expose the error.
    }
  };

  const handleDeleteSchedule = async () => {
    if (!employee) return;

    try {
      await deleteSchedule(employee.id);
      resetSchedule({
        expectedCheckIn: '08:00',
        expectedCheckOut: '17:00',
        lateToleranceMinutes: 15,
      });
      onSaved?.();
    } catch {
      // Store and toast already expose the error.
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {employee ? 'Detalhes do Funcionário' : 'Novo Funcionário'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {isLoadingDetail && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <p className="text-sm text-gray-600">Carregando detalhes...</p>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              {...register('name')}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              disabled={!!employee}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefone
            </label>
            <input
              type="tel"
              placeholder="+244923456789"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              {...register('phone')}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Área
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              {...register('area')}
            >
              {employeeAreas.map((area) => (
                <option key={area} value={area}>
                  {employeeAreaLabels[area]}
                </option>
              ))}
            </select>
            {errors.area && (
              <p className="mt-1 text-sm text-red-600">{errors.area.message}</p>
            )}
          </div>

          <div>
            {!employee ? (
              <>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                placeholder="Senha123"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
              </>
            ) : selectedEmployee ? (
              <div className="grid grid-cols-1 gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm md:grid-cols-3">
                <div>
                  <p className="text-gray-500">Estado</p>
                  <p className="font-medium text-gray-900">
                    {selectedEmployee.isActive ? 'Ativo' : 'Inativo'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">QR Code</p>
                  <p className="font-medium text-gray-900">
                    {selectedEmployee.qrCode?.status ?? 'Sem QR'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Criado em</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedEmployee.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            {employee && selectedEmployee && (
              <button
                type="button"
                onClick={handleToggleActive}
                disabled={isSaving}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {selectedEmployee.isActive ? 'Desativar' : 'Ativar'}
              </button>
            )}
            <button
              type="submit"
              disabled={isCreating || isSaving}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCreating || isSaving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>

        {employee && (
          <form
            onSubmit={handleScheduleSubmit(onScheduleSubmit)}
            className="space-y-4 border-t border-gray-200 p-6"
          >
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Horário de Trabalho
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Defina entrada, saída e tolerância de atraso.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Entrada
                </label>
                <input
                  type="time"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  {...registerSchedule('expectedCheckIn')}
                />
                {scheduleErrors.expectedCheckIn && (
                  <p className="mt-1 text-sm text-red-600">
                    {scheduleErrors.expectedCheckIn.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Saída
                </label>
                <input
                  type="time"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  {...registerSchedule('expectedCheckOut')}
                />
                {scheduleErrors.expectedCheckOut && (
                  <p className="mt-1 text-sm text-red-600">
                    {scheduleErrors.expectedCheckOut.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Tolerância
                </label>
                <input
                  type="number"
                  min={0}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  {...registerSchedule('lateToleranceMinutes')}
                />
                {scheduleErrors.lateToleranceMinutes && (
                  <p className="mt-1 text-sm text-red-600">
                    {scheduleErrors.lateToleranceMinutes.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleDeleteSchedule}
                disabled={isSaving || !selectedEmployee?.schedule}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Remover Horário
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-2 font-medium text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? 'Guardando...' : 'Guardar Horário'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
