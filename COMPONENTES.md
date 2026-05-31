# 📦 Inventário de Componentes

## Componentes Admin

### Header
**Arquivo**: `components/admin/header.tsx`

Componente de cabeçalho exibido em todas as páginas admin.

**Props**:
- `title: string` - Título da página
- `description?: string` - Descrição opcional

**Funcionalidades**:
- Notificações (badge de alerta)
- Perfil do usuário
- Nome e departamento

---

### Sidebar
**Arquivo**: `components/admin/sidebar.tsx`

Navegação lateral fixa com menu de páginas.

**Funcionalidades**:
- Logo SmartFlow
- Menu de navegação (5 itens)
- Highlight da página ativa
- Botão de logout
- Gradient purple background

**Links**:
- Dashboard
- Funcionários
- Presenças
- Relatórios
- Configurações

---

### StatCard
**Arquivo**: `components/admin/stat-card.tsx`

Card para exibir estatísticas.

**Props**:
- `label: string` - Rótulo da estatística
- `value: number | string` - Valor a exibir
- `icon?: ReactNode` - Ícone opcional
- `trend?: 'up' | 'down' | 'stable'` - Indicador de tendência
- `backgroundColor?: string` - Classe bg customizada
- `textColor?: string` - Classe text customizada
- `iconBgColor?: string` - Classe de bg do ícone

**Exemplo**:
```tsx
<StatCard
  label="Total de Funcionários"
  value={5}
  icon={<Users className="w-6 h-6" />}
  trend="stable"
  textColor="text-purple-600"
  iconBgColor="bg-purple-100"
/>
```

---

### EmployeesTable
**Arquivo**: `components/admin/employees-table.tsx`

Tabela responsiva de funcionários.

**Props**:
- `employees: Employee[]` - Lista de funcionários
- `onEdit?: (employee: Employee) => void` - Callback de edição
- `onDelete?: (id: string) => void` - Callback de exclusão

**Funcionalidades**:
- 6 colunas (Nome, Email, Depto, Posição, Status, Ações)
- Botões de ação (Editar, Deletar, Visualizar)
- Status badge (Ativo/Inativo)
- Hover effects
- Modal integrado

---

### EmployeeModal
**Arquivo**: `components/admin/employee-modal.tsx`

Modal para criar/editar funcionários.

**Props**:
- `isOpen: boolean` - Visibilidade
- `employee: Employee | null` - Funcionário a editar (null = novo)
- `onClose: () => void` - Callback de fechamento

**Campos**:
- Nome (input)
- Email (input)
- Departamento (select)
- Posição (input)
- Status (select: Ativo/Inativo)

**Botões**:
- Cancelar
- Salvar

---

### AttendanceTable
**Arquivo**: `components/admin/attendance-table.tsx`

Tabela de registros de presença.

**Props**:
- `attendance: Attendance[]` - Lista de registros
- `employees: Employee[]` - Lista de funcionários para lookup

**Funcionalidades**:
- 5 colunas (Funcionário, Data, Entrada, Saída, Status)
- Ícones de status coloridos
- Badges de status
- Dados formatados

**Status**:
- ✅ Presente (Verde)
- ⚠️ Atrasado (Amarelo)
- ❌ Ausente (Vermelho)
- ℹ️ Meio Período (Azul)

---

### AddEmployeeButton
**Arquivo**: `components/admin/add-employee-button.tsx`

Botão flutuante para adicionar novo funcionário.

**Props**:
- `onAdd?: (employee: Employee) => void` - Callback (opcional)

**Funcionalidades**:
- Ícone Plus
- Abre modal
- Gradient purple background

---

## Contextos e Hooks

### AuthContext
**Arquivo**: `lib/auth-context.tsx`

Gerencia autenticação global.

**Interface**:
```tsx
interface AuthContextType {
  coordinator: Coordinator | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
```

**Hook**:
```tsx
const { coordinator, isLoading, login, logout, isAuthenticated } = useAuth();
```

---

## Dados e Utilitários

### mock-data.ts
**Arquivo**: `lib/mock-data.ts`

Contém dados simulados e tipos.

**Interfaces**:
- `Employee` - Funcionário
- `Attendance` - Registro de presença
- `Department` - Departamento

**Dados**:
- `mockEmployees` - 5 funcionários
- `mockAttendance` - 7 registros
- `mockDepartments` - 5 departamentos
- `getEmployeeStats()` - Calcula estatísticas

---

### theme.ts
**Arquivo**: `lib/theme.ts`

Paleta de cores do sistema.

**Cores Disponíveis**:
- primary, primaryLight, primaryDark
- secondary
- background, surface, surfaceAlt
- text, textSecondary
- border
- success, warning, danger, info

---

## Páginas

### Login
**Arquivo**: `app/login/page.tsx`

Página de autenticação split design.

**Componentes**:
- Form de login
- Campo Email
- Campo Senha
- Botão Entrar
- Link de recuperação
- Credenciais de demo

---

### Dashboard
**Arquivo**: `app/admin/dashboard/page.tsx`

Página principal com visão geral.

**Componentes**:
- Header
- 4 StatCards
- AttendanceTable
- 3 QuickStats Cards

---

### Employees
**Arquivo**: `app/admin/employees/page.tsx`

Gerenciamento de funcionários.

**Componentes**:
- Header
- Search input
- Export button
- AddEmployeeButton
- 3 Summary cards
- EmployeesTable

---

### Attendance
**Arquivo**: `app/admin/attendance/page.tsx`

Controle de presenças.

**Componentes**:
- Header
- Date filter
- Status filter
- 5 Stat cards
- AttendanceTable

---

### Reports
**Arquivo**: `app/admin/reports/page.tsx`

Análises e relatórios.

**Componentes**:
- Header
- Export buttons
- PieChart (Recharts)
- BarChart (Recharts)
- 4 Stat cards (percentuais)

---

### Settings
**Arquivo**: `app/admin/settings/page.tsx`

Configurações do usuário.

**Seções**:
- Perfil (read-only)
- Notificações (toggles)
- Segurança
- Aparência (dark mode)
- Save button

---

## Layouts

### Root Layout
**Arquivo**: `app/layout.tsx`

Layout raiz com:
- AuthProvider wrapper
- Metadata
- Global styles

### Admin Layout
**Arquivo**: `app/admin/layout.tsx`

Layout do painel com:
- Sidebar
- Proteção de rotas
- Children

### Login Layout
**Arquivo**: `app/login/layout.tsx`

Layout simples para login.

---

## Integrações

### Recharts
Para gráficos em `reports/page.tsx`:
- `PieChart` - Distribuição de presença
- `BarChart` - Funcionários por departamento

### Lucide React
Ícones utilizados:
- Users, Clock, BarChart3, Settings, LogOut
- Bell, User, Menu
- Edit2, Trash2, Eye
- CheckCircle, AlertCircle, XCircle
- Plus, Download, FileText
- Calendar, Filter, Save, Palette, Lock

---

## Padrões de Código

### Componentes Cliente
```tsx
'use client';

import { useState } from 'react';

export function MeuComponente({ prop }: Props) {
  return <div>{prop}</div>;
}
```

### Componentes Servidor
```tsx
import { ComponenteCliente } from '@/components/...';

export default function MinhaPage() {
  const dados = await fetchDados();
  
  return <ComponenteCliente dados={dados} />;
}
```

### Estilos Tailwind
```tsx
<div className="flex items-center gap-4 px-4 py-2 rounded-lg bg-purple-100 hover:bg-purple-200 transition-colors">
  {/* Conteúdo */}
</div>
```

---

**Total de Componentes**: 7 principais  
**Total de Páginas**: 6  
**Total de Layouts**: 3  
**Total de Contextos**: 1  

