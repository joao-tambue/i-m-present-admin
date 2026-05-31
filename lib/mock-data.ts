export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  joinDate: string;
  status: 'active' | 'inactive';
  qrCode: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: 'present' | 'late' | 'absent' | 'half-day';
}

export interface Department {
  id: string;
  name: string;
  manager: string;
  employeeCount: number;
}

export const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana.silva@company.com',
    department: 'Vendas',
    position: 'Coordenadora de Vendas',
    joinDate: '2022-03-15',
    status: 'active',
    qrCode: 'QR001-ANA-SILVA',
  },
  {
    id: '2',
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@company.com',
    department: 'TI',
    position: 'Desenvolvedor Sênior',
    joinDate: '2021-06-22',
    status: 'active',
    qrCode: 'QR002-CARLOS-OLI',
  },
  {
    id: '3',
    name: 'Maria Santos',
    email: 'maria.santos@company.com',
    department: 'RH',
    position: 'Gerente de RH',
    joinDate: '2020-01-10',
    status: 'active',
    qrCode: 'QR003-MARIA-SANT',
  },
  {
    id: '4',
    name: 'João Pereira',
    email: 'joao.pereira@company.com',
    department: 'Financeiro',
    position: 'Analista Financeiro',
    joinDate: '2021-09-05',
    status: 'active',
    qrCode: 'QR004-JOAO-PEREI',
  },
  {
    id: '5',
    name: 'Patricia Costa',
    email: 'patricia.costa@company.com',
    department: 'Marketing',
    position: 'Especialista em Marketing',
    joinDate: '2022-11-20',
    status: 'inactive',
    qrCode: 'QR005-PATRICIA-COS',
  },
];

export const mockAttendance: Attendance[] = [
  {
    id: '1',
    employeeId: '1',
    date: '2026-05-31',
    checkInTime: '08:45',
    checkOutTime: '17:30',
    status: 'present',
  },
  {
    id: '2',
    employeeId: '2',
    date: '2026-05-31',
    checkInTime: '09:15',
    checkOutTime: '17:45',
    status: 'late',
  },
  {
    id: '3',
    employeeId: '3',
    date: '2026-05-31',
    checkInTime: '08:30',
    checkOutTime: '17:15',
    status: 'present',
  },
  {
    id: '4',
    employeeId: '4',
    date: '2026-05-31',
    checkInTime: null,
    checkOutTime: null,
    status: 'absent',
  },
  {
    id: '5',
    employeeId: '5',
    date: '2026-05-31',
    checkInTime: '08:50',
    checkOutTime: '12:00',
    status: 'half-day',
  },
  {
    id: '6',
    employeeId: '1',
    date: '2026-05-30',
    checkInTime: '08:55',
    checkOutTime: '17:25',
    status: 'present',
  },
  {
    id: '7',
    employeeId: '2',
    date: '2026-05-30',
    checkInTime: '08:30',
    checkOutTime: '17:30',
    status: 'present',
  },
];

export const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Vendas',
    manager: 'Ana Silva',
    employeeCount: 8,
  },
  {
    id: '2',
    name: 'TI',
    manager: 'Carlos Oliveira',
    employeeCount: 12,
  },
  {
    id: '3',
    name: 'RH',
    manager: 'Maria Santos',
    employeeCount: 5,
  },
  {
    id: '4',
    name: 'Financeiro',
    manager: 'João Pereira',
    employeeCount: 6,
  },
  {
    id: '5',
    name: 'Marketing',
    manager: 'Patricia Costa',
    employeeCount: 4,
  },
];

export const getEmployeeStats = () => {
  const total = mockEmployees.length;
  const active = mockEmployees.filter((e) => e.status === 'active').length;
  const inactive = mockEmployees.filter((e) => e.status === 'inactive').length;

  const todayAttendance = mockAttendance.filter(
    (a) => a.date === '2026-05-31'
  );
  const presentCount = todayAttendance.filter(
    (a) => a.status === 'present'
  ).length;
  const lateCount = todayAttendance.filter((a) => a.status === 'late').length;
  const absentCount = todayAttendance.filter(
    (a) => a.status === 'absent'
  ).length;

  return {
    totalEmployees: total,
    activeEmployees: active,
    inactiveEmployees: inactive,
    presentToday: presentCount,
    lateToday: lateCount,
    absentToday: absentCount,
    attendanceRate: Math.round(
      ((presentCount + lateCount) / (total - inactive)) * 100
    ),
  };
};
