# 🚀 Guia Rápido - SmartFlow

## Começar em 30 segundos

### 1. Instalar
```bash
pnpm install
```

### 2. Executar
```bash
pnpm dev
```

### 3. Acessar
```
http://localhost:3000
```

## 📝 Login

**Email**: `demo@smartflow.com`  
**Senha**: `123456`

## 🗺️ Navegação

```
┌─────────────────────────────────────┐
│         SmartFlow                   │
│    Gerenciamento de Presença        │
├─────────────────────────────────────┤
│                                     │
│  📊 Dashboard                       │ ← Visão Geral
│  👥 Funcionários                    │ ← Gerenciar Pessoas
│  ⏰ Presenças                       │ ← Ver Entradas/Saídas
│  📈 Relatórios                      │ ← Análises e Gráficos
│  ⚙️  Configurações                  │ ← Perfil e Preferências
│                                     │
│  🚪 Sair                            │ ← Logout
│                                     │
└─────────────────────────────────────┘
```

## 💡 Funcionalidades Principais

### Dashboard
- 4 cards com estatísticas
- Tabela de presença do dia
- Indicadores de status

### Funcionários
- Pesquisar por nome/email/departamento
- Adicionar novo funcionário (modal)
- Editar funcionário existente
- Deletar funcionário
- Ver resumo (Total, Ativos, Inativos)

### Presenças
- Filtrar por data
- Filtrar por status (Presente, Atrasado, Ausente, Meio Período)
- Ver entrada/saída
- Visualizar ícones de status

### Relatórios
- Gráfico de Pizza: Distribuição de presença
- Gráfico de Barras: Funcionários por departamento
- Percentuais: Taxa de Presença, Atraso, Ausência
- Exportar PDF/Excel (estrutura)

### Configurações
- Visualizar perfil
- Gerenciar notificações
- Alterar password (estrutura)
- Dark mode (estrutura)

## 🎨 Cores do Sistema

| Elemento | Cor |
|----------|-----|
| Primary (Buttons) | Purple (#9333ea) |
| Secondary | Pink (#ec4899) |
| Sucesso (Present) | Green (#10b981) |
| Aviso (Late) | Yellow (#f59e0b) |
| Erro (Absent) | Red (#ef4444) |
| Info (Half-day) | Blue (#3b82f6) |

## 📂 Estrutura de Pastas

```
projeto/
├── app/                 # Páginas Next.js
├── components/          # Componentes React
├── lib/                 # Utilitários e contextos
├── public/             # Assets estáticos
└── README.md           # Documentação
```

## 🛠️ Tecnologias Usadas

- Next.js 16 - Framework React
- TypeScript - Tipagem
- Tailwind CSS - Estilos
- Lucide React - Ícones
- Recharts - Gráficos
- React Context - Estado Global

## 🔐 Dados Simulados

Todos os dados são **simulados em memória**:
- 5 Funcionários
- 7 Registros de Presença
- 5 Departamentos
- Estatísticas em tempo real

## 🎯 Comandos Úteis

```bash
# Desenvolvimento
pnpm dev

# Build
pnpm build

# Executar build
pnpm start

# Lint
pnpm lint

# Type check
pnpm type-check
```

## ❌ Troubleshooting

### Porta 3000 já está em uso
```bash
# Use outra porta
pnpm dev -- -p 3001
```

### Erro de módulos
```bash
# Limpar node_modules e reinstalar
rm -rf node_modules
pnpm install
```

### Erro de autenticação
```
Certifique-se de usar:
Email: demo@smartflow.com
Senha: 123456
```

## 📱 Responsividade

- ✅ Mobile (320px+)
- ✅ Tablet (768px+)
- ✅ Desktop (1024px+)
- ✅ Wide (1280px+)

## 🚀 Fazer Deploy

### Vercel (Recomendado)
```bash
npm i -g vercel
vercel
```

### Docker
```bash
docker build -t smartflow .
docker run -p 3000:3000 smartflow
```

## 💬 Suporte

Para problemas, verifique:
1. Node.js versão (16+)
2. pnpm instalado
3. Porta 3000 disponível
4. Credenciais corretas

## 🎉 Próximas Etapas

1. Conectar com backend real
2. Implementar QR code scanning
3. Adicionar banco de dados
4. Configurar autenticação real
5. Implementar notificações

---

**Criado com ❤️ usando v0**
