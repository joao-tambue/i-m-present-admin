# I'm Present - Sistema de Gerenciamento de Presença

Um painel administrativo completo para coordenadores gerenciarem presença de funcionários com QR code, desenvolvido com Next.js, React e Tailwind CSS.

## Funcionalidades

- **Autenticação**: Login seguro para coordenadores
- **Dashboard**: Visão geral com estatísticas em tempo real
- **Gerenciamento de Funcionários**: CRUD completo com status ativo/inativo
- **Controle de Presenças**: Registro e acompanhamento de entrada/saída
- **Relatórios**: Gráficos e análises detalhadas com Recharts
- **Configurações**: Personalizações de perfil, notificações e segurança
- **Design Responsivo**: Interface adaptada para mobile, tablet e desktop

## Arquitetura

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

## Design

### Paleta de Cores

- **Primary**: Purple-600 (#9333ea)
- **Secondary**: Pink-500 (#ec4899)
- **Background**: White (#ffffff)
- **Surface**: Gray-50 (#f9f7f4)
- **Text**: Gray-800 (#1f2937)

## Autenticação

### Fluxo de Login

1. Usuário acessa `/login`
2. Insere email e senha
3. Sistema valida credenciais
4. Redireciona para `/admin/dashboard`

### Credenciais de Demonstração

- **Email**: `demo@smartflow.com`
- **Senha**: `123456`

### Proteção de Rotas

- Todas as rotas em `/admin/*` requerem autenticação
- Usuário não autenticado é redirecionado para `/login`
- Contexto `AuthProvider` gerencia estado global

## Como Usar

### Instalação

```bash
# Instalar dependências
pnpm install

# Executar servidor de desenvolvimento
pnpm dev
```

Acesse `http://localhost:3000` no navegador.
