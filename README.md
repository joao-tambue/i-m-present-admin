# SmartFlow - Sistema de Gerenciamento de Presença

Um painel administrativo completo para coordenadores gerenciarem presença de funcionários com QR code, desenvolvido com Next.js, React e Tailwind CSS.

## 🎯 Funcionalidades

- **Autenticação**: Login seguro para coordenadores
- **Dashboard**: Visão geral com estatísticas em tempo real
- **Gerenciamento de Funcionários**: CRUD completo com status ativo/inativo
- **Controle de Presenças**: Registro e acompanhamento de entrada/saída
- **Relatórios**: Gráficos e análises detalhadas com Recharts
- **Configurações**: Personalizações de perfil, notificações e segurança
- **Design Responsivo**: Interface adaptada para mobile, tablet e desktop

## 🏗️ Arquitetura

### Estrutura de Pastas

```
/vercel/share/v0-project/
├── app/
│   ├── admin/               # Páginas protegidas do painel
│   │   ├── dashboard/       # Dashboard principal
│   │   ├── employees/       # Gerenciamento de funcionários
│   │   ├── attendance/      # Controle de presenças
│   │   ├── reports/         # Relatórios e análises
│   │   └── settings/        # Configurações
│   ├── login/              # Página de autenticação
│   ├── layout.tsx          # Layout raiz com AuthProvider
│   ├── page.tsx            # Redirecionamento para login
│   └── globals.css         # Estilos globais
├── components/
│   └── admin/              # Componentes reutilizáveis
│       ├── sidebar.tsx     # Navegação lateral
│       ├── header.tsx      # Cabeçalho com perfil
│       ├── stat-card.tsx   # Cards de estatísticas
│       ├── employees-table.tsx
│       ├── employee-modal.tsx
│       ├── attendance-table.tsx
│       └── add-employee-button.tsx
├── lib/
│   ├── mock-data.ts        # Dados simulados
│   ├── auth-context.tsx    # Contexto de autenticação
│   ├── theme.ts            # Configuração de cores
│   └── protected-route.tsx  # Proteção de rotas
└── tailwind.config.ts      # Configuração do Tailwind
```

## 🎨 Design

### Paleta de Cores

- **Primary**: Purple-600 (#9333ea)
- **Secondary**: Pink-500 (#ec4899)
- **Background**: White (#ffffff)
- **Surface**: Gray-50 (#f9f7f4)
- **Text**: Gray-800 (#1f2937)

### Componentes Principais

1. **Sidebar**: Navegação fixa com menu de páginas
2. **Header**: Barra superior com notificações e perfil
3. **StatCard**: Cards de estatísticas com ícones
4. **Tables**: Tabelas com dados e ações
5. **Modal**: Diálogos para edição de dados
6. **Charts**: Gráficos com Recharts

## 🔐 Autenticação

### Fluxo de Login

1. Usuário acessa `/login`
2. Insere email e senha
3. Sistema valida credenciais (mock)
4. Redireciona para `/admin/dashboard`

### Credenciais de Demonstração

- **Email**: `demo@smartflow.com`
- **Senha**: `123456`

### Proteção de Rotas

- Todas as rotas em `/admin/*` requerem autenticação
- Usuário não autenticado é redirecionado para `/login`
- Contexto `AuthProvider` gerencia estado global

## 📊 Dados Simulados

O sistema usa dados mock em `lib/mock-data.ts`:

- **Funcionários**: 5 registros com informações completas
- **Presenças**: 7 registros de entrada/saída
- **Departamentos**: 5 departamentos com gerentes
- **Estatísticas**: Cálculos em tempo real

## 🚀 Como Usar

### Instalação

```bash
# Instalar dependências
pnpm install

# Executar servidor de desenvolvimento
pnpm dev
```

Acesse `http://localhost:3000` no navegador.

### Navegação

1. **Dashboard** - Visão geral com stats e presença do dia
2. **Funcionários** - Listar, adicionar, editar e deletar funcionários
3. **Presenças** - Ver registros de entrada/saída com filtros
4. **Relatórios** - Gráficos de distribuição e análises
5. **Configurações** - Gerenciar perfil e preferências

## 📈 Páginas e Funcionalidades

### Login (`/login`)

- Form com email e senha
- Validação de campos
- Integração com AuthContext
- Design split com imagem inspiradora

### Dashboard (`/admin/dashboard`)

- Stats em cards (Total, Ativos, Presentes, Taxa)
- Tabela de presença do dia
- Cards de resumo rápido
- Indicadores de status

### Funcionários (`/admin/employees`)

- Pesquisa por nome/email/departamento
- Cards de resumo (Total, Ativos, Inativos)
- Tabela com ações (editar, deletar, visualizar)
- Modal para criar/editar
- Botão de exportação

### Presenças (`/admin/attendance`)

- Filtro por data
- Filtro por status (Presente, Atrasado, Ausente, Meio Período)
- Stats de presença
- Tabela com ícones de status

### Relatórios (`/admin/reports`)

- Gráfico de Pizza: Distribuição de status
- Gráfico de Barras: Funcionários por departamento
- Stats percentuais (Taxa de Presença, Atraso, Ausência)
- Botões de exportação

### Configurações (`/admin/settings`)

- Perfil do coordenador (read-only)
- Notificações (toggles)
- Segurança (alterar senha)
- Aparência (modo escuro)
- Botão de salvar

## 🛠️ Tecnologias

- **Framework**: Next.js 16 (App Router)
- **React**: 19.2
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: React Context + Hooks
- **Language**: TypeScript

## 📦 Dependências Principais

```json
{
  "next": "^16.0.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "recharts": "^2.10.0",
  "lucide-react": "^0.294.0",
  "tailwindcss": "^4.0.0"
}
```

## 🔄 Fluxo de Estado

```
AuthContext
├── coordinator (Coordinator | null)
├── isLoading (boolean)
├── isAuthenticated (boolean)
├── login(email, password)
└── logout()

App State
├── employees (Employee[])
├── attendance (Attendance[])
└── filters (date, status)
```

## 🎯 Próximas Melhorias

- [ ] Integração com banco de dados real
- [ ] QR code scanning e geração
- [ ] API de autenticação real
- [ ] Envio de relatórios por email
- [ ] Sistema de notificações em tempo real
- [ ] Dark mode completo
- [ ] Multi-idioma (i18n)
- [ ] Testes automatizados
- [ ] Autenticação OAuth

## 📝 Licença

Este projeto foi criado com v0 e é fornecido como exemplo educacional.
