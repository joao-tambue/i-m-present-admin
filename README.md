# Sistema de Controle de Ponto (TLS)

Este é um projeto completo de controle de ponto e gestão de presença via QR Code, desenvolvido com tecnologias modernas de Frontend (Next.js) e Backend (Node.js/Express). 

O sistema é dividido em três módulos principais:
1. **Admin (`/admin`)**: Aplicação web para coordenadores e administradores.
2. **Funcionario App (`/funcionario-app`)**: Aplicação web/mobile para uso dos funcionários.
3. **Backend API (`/qr-code`)**: API RESTful que gerencia toda a regra de negócio e banco de dados.

---

## 🏗 Arquitetura do Sistema

### 1. `admin` (Painel Administrativo)
Aplicação frontend desenvolvida para permitir que gestores e coordenadores administrem o sistema.
- **Tecnologias**: Next.js 14+, React 19, Tailwind CSS, Shadcn UI, Zustand (gerenciamento de estado), React Hook Form, Zod, Axios.
- **Principais Funcionalidades**:
  - Dashboard geral com métricas de presença.
  - Gestão de funcionários (Criação, Edição, Inativação).
  - Acompanhamento de relatórios de ponto e histórico de presenças.
  - Definição de horários de trabalho (`workSchedule`) e tolerâncias.

### 2. `funcionario-app` (Aplicativo do Funcionário)
Aplicação voltada exclusivamente para os funcionários registrarem e acompanharem seus pontos.
- **Tecnologias**: Next.js 14+, React 19, Tailwind CSS, Shadcn UI, Zustand, HTML5-QRCode (para leitura de QR codes), Axios.
- **Principais Funcionalidades**:
  - Login individual do funcionário.
  - Visualização de um QR Code único para check-in/check-out.
  - Leitura de QR Codes (se configurado como totem).
  - Histórico pessoal de presenças e atrasos.
  - Visualização de horários agendados.

### 3. `qr-code` (Backend / API REST)
Motor de regras de negócio, autenticação e comunicação com o banco de dados.
- **Tecnologias**: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, JWT (JSON Web Tokens), Bcryptjs, Swagger (documentação da API).
- **Principais Funcionalidades**:
  - Autenticação JWT baseada em Roles (`COORDINATOR`, `EMPLOYEE`).
  - Geração e Validação de QR Codes (`EmployeeQRCode`).
  - Lógica complexa de registro de ponto (`AttendanceRecord`), lidando com tolerância de atrasos e status (Presente, Atrasado, Faltou, Incompleto).
  - Documentação da API com Swagger UI.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- Node.js (v18 ou superior)
- PostgreSQL (rodando localmente ou via Docker)
- Gerenciador de pacotes (`npm` ou `pnpm`)

### Configurando o Backend (`/qr-code`)
1. Acesse o diretório: `cd qr-code`
2. Instale as dependências: `npm install`
3. Crie um arquivo `.env` na raiz da pasta baseado no `.env.example` com a URL do seu banco de dados PostgreSQL.
4. Execute as migrations do Prisma: `npx prisma migrate dev`
5. Execute as seeds (opcional, para criar um admin padrão): `npx tsx prisma/seed.ts`
6. Inicie o servidor em modo de desenvolvimento: `npm run dev`

### Configurando o Frontend Admin (`/admin`)
1. Acesse o diretório: `cd admin`
2. Instale as dependências: `npm install` ou `pnpm install`
3. Configure o arquivo `.env` com a URL da API (ex: `NEXT_PUBLIC_API_URL=http://localhost:3000`)
4. Inicie a aplicação: `npm run dev`

### Configurando o Frontend Funcionário (`/funcionario-app`)
1. Acesse o diretório: `cd funcionario-app`
2. Instale as dependências: `npm install` ou `pnpm install`
3. Configure o arquivo `.env` com a URL da API.
4. Inicie a aplicação: `npm run dev`

---

## 🔒 Regras de Negócio e Segurança
- Senhas são criptografadas via **Bcrypt** no banco de dados.
- A autenticação é stateless via **JWT**.
- O QR Code do funcionário pode ser revogado e um novo pode ser gerado caso necessário, prevenindo fraudes.
- A presença possui uma regra estrita de validação: "Check-in" seguido de "Check-out" no mesmo dia. Tolerâncias de minutos são parametrizadas no perfil do funcionário.
