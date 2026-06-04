# Diagramas do Sistema (Controle de Ponto via QR Code)

Este documento centraliza todos os diagramas arquiteturais e estruturais que representam o funcionamento do sistema composto pelos módulos `admin`, `funcionario-app` e backend `qr-code`.

---

## 1. Diagrama de Casos de Uso
Demonstra as interações principais que os atores (Admin/Coordenador e Funcionário) possuem com o sistema.

```mermaid
flowchart LR
    Admin((Administrador / Coordenador))
    Employee((Funcionário))

    subgraph TLS Sistema de Ponto
        Login(Realizar Login)
        ManageEmp(Gerenciar Funcionários)
        ViewReport(Acompanhar Relatórios e Presenças)
        ManageSchedules(Configurar Horários de Trabalho)
        
        CheckIn(Registrar Ponto - Check In / Check Out via QR Code)
        ViewHistory(Visualizar Histórico Pessoal)
    end

    Admin --> Login
    Admin --> ManageEmp
    Admin --> ViewReport
    Admin --> ManageSchedules

    Employee --> Login
    Employee --> CheckIn
    Employee --> ViewHistory
```

---

## 2. Diagrama de Entidade e Relacionamento (ER / Banco de Dados)
Representação das tabelas no PostgreSQL (criadas via Prisma ORM) e suas relações.

```mermaid
erDiagram
    COORDINATOR {
        String id PK
        String name
        String email
        String phone
        String password
        Role role
        DateTime createdAt
        DateTime updatedAt
    }

    EMPLOYEE {
        String id PK
        String name
        String email
        String phone
        Area area
        String password
        Role role
        Boolean isActive
        DateTime createdAt
        DateTime updatedAt
    }

    EMPLOYEE_QR_CODE {
        String id PK
        String code UK "UUID"
        QRCodeStatus status
        String employeeId FK
        DateTime issuedAt
        DateTime revokedAt
    }

    ATTENDANCE_RECORD {
        String id PK
        String employeeId FK
        DateTime date
        DateTime checkInAt
        DateTime checkOutAt
        String checkInMethod
        String checkOutMethod
        AttendanceStatus status
        Int lateMinutes
        Int workedMinutes
        String notes
    }

    WORK_SCHEDULE {
        String id PK
        String employeeId FK
        String expectedCheckIn
        String expectedCheckOut
        Int lateToleranceMinutes
    }

    EMPLOYEE ||--o| EMPLOYEE_QR_CODE : possui
    EMPLOYEE ||--o{ ATTENDANCE_RECORD : registra
    EMPLOYEE ||--o| WORK_SCHEDULE : atrelado
```

---

## 3. Diagrama de Classes (Backend / Modelos de Domínio)
Apresenta a estrutura de classes de domínio inferidas a partir dos modelos de dados.

```mermaid
classDiagram
    class Coordinator {
        +String id
        +String name
        +String email
        +String phone
        +Role role
        +login()
        +manageEmployee()
    }

    class Employee {
        +String id
        +String name
        +String email
        +Area area
        +Role role
        +Boolean isActive
        +login()
        +viewHistory()
    }

    class EmployeeQRCode {
        +String id
        +String code
        +QRCodeStatus status
        +DateTime issuedAt
        +generateCode()
        +revokeCode()
    }

    class AttendanceRecord {
        +String id
        +DateTime date
        +DateTime checkInAt
        +DateTime checkOutAt
        +AttendanceStatus status
        +Int lateMinutes
        +markCheckIn()
        +markCheckOut()
        +calculateWorkedMinutes()
    }

    class WorkSchedule {
        +String id
        +String expectedCheckIn
        +String expectedCheckOut
        +Int lateToleranceMinutes
    }

    Employee "1" -- "1" EmployeeQRCode : has
    Employee "1" -- "*" AttendanceRecord : has
    Employee "1" -- "1" WorkSchedule : uses
```

---

## 4. Diagrama de Sequência (Fluxo de Registro de Ponto via QR Code)
Descreve a sequência de eventos de quando o funcionário efetua o Check-in/Check-out.

```mermaid
sequenceDiagram
    actor Employee as Funcionário
    participant App as Funcionario App (Next.js)
    participant API as Backend API (Express)
    participant DB as Banco de Dados (PostgreSQL)

    Employee->>App: Abre o app / Exibe o QR Code
    App->>API: POST /api/attendance/scan { code: "UUID do QR" }
    
    API->>DB: Busca QRCode e valida status (ACTIVE?)
    DB-->>API: Retorna dados do QRCode (employeeId)
    
    API->>DB: Busca regras de horário (WorkSchedule) do funcionário
    DB-->>API: Retorna horários esperados e tolerância
    
    API->>DB: Verifica registro de presença de "hoje"
    DB-->>API: Retorna registro (se existir)
    
    alt Registro de Hoje NÃO Existe (É Check-In)
        API->>API: Calcula minutos de atraso (se houver) baseado no WorkSchedule
        API->>DB: Cria novo AttendanceRecord (checkInAt = agora)
        DB-->>API: Sucesso (Record Criado)
        API-->>App: 200 OK - "Check-in realizado com sucesso"
    else Registro Existe mas sem Check-Out (É Check-Out)
        API->>API: Calcula total de horas trabalhadas
        API->>DB: Atualiza AttendanceRecord (checkOutAt = agora, status = PRESENT)
        DB-->>API: Sucesso (Record Atualizado)
        API-->>App: 200 OK - "Check-out realizado com sucesso"
    else Registro Existe e já tem Check-Out
        API-->>App: 400 Bad Request - "Ponto já foi registrado e encerrado hoje"
    end
    
    App-->>Employee: Exibe notificação de Sucesso ou Erro
```
