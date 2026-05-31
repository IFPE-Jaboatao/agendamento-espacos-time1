# Regras de Negócio - Sistema de Agendamento e Gestão de Espaços

---

## 1. Autenticação e Usuários

### 1.1 Login
- Usuário deve existir no sistema
- Senha deve ser validada com hash
- Em caso de falha, retorna mensagem genérica ("Login ou senha inválidos")

### 1.2 Segurança
- Senhas são armazenadas com hash seguro
- Senhas nunca são retornadas nas respostas
- Autenticação obrigatória via JWT

### 1.3 Token
- Token JWT expira em **8 horas**

### 1.4 Cadastro
- Email deve ser único
- Login deve ser único
- Perfil é sempre definido como `USUARIO` no cadastro comum
- O cliente não pode definir perfil manualmente

### 1.5 Tipo de Usuário
- Tipo padrão: `ALUNO`
- Apenas ADMIN pode criar usuários com outros tipos (`PROFESSOR`, `COORDENADOR`)
- Usuário comum não pode alterar tipo de usuário

---

## 2. Perfis e Permissões

### 2.1 ADMIN
- Gerencia usuários
- Visualiza todas as reservas
- Visualiza todos os históricos
- Cria, edita e remove espaços
- Aprova e recusa reservas
- Pode cancelar qualquer reserva

### 2.2 USUÁRIO
- Acessa apenas seus próprios dados
- Visualiza apenas suas reservas
- Visualiza apenas seus históricos
- Pode criar reservas
- Pode cancelar apenas suas próprias reservas

---

## 3. Espaços

### 3.1 Tipos de espaço
- laboratório
- sala
- auditório

### 3.2 Status
- ATIVO
- INATIVO

### 3.3 Regras
- Apenas espaços com status `ATIVO` podem ser reservados
- Apenas ADMIN pode gerenciar espaços
- Espaços com reservas vinculadas não podem ser removidos

---

## 4. Reservas

### 4.1 Criação
- Data de início e fim são obrigatórias
- Data final deve ser maior que a inicial
- Não permite reservas no passado
- O espaço deve existir
- O espaço deve estar ativo

### 4.2 Conflito de horário
- Não pode existir sobreposição de reservas no mesmo espaço
- Reservas `PENDENTE` ou `APROVADA` bloqueiam o horário

### 4.3 Status
- Toda reserva inicia como `PENDENTE`
- Pode evoluir para:
  - `APROVADA`
  - `RECUSADA`
  - `CANCELADA`

> Apenas reservas `PENDENTES` podem ser aprovadas ou recusadas.

---

### 4.4 Cancelamento
- Usuário pode cancelar sua própria reserva
- ADMIN pode cancelar qualquer reserva
- Reserva já cancelada não pode ser cancelada novamente
- Reservas canceladas não podem ser aprovadas ou recusadas

---

### 4.5 Aprovação e Recusa
- Apenas ADMIN pode aprovar ou recusar reservas
- Recusa exige motivo obrigatório
- Reservas já processadas não podem ser alteradas novamente
- Aprovação e recusa são registradas com data e usuário responsável

---

## 5. Histórico (Auditoria)

### 5.1 Regra geral
- Toda ação relevante em reservas gera log automático

### 5.2 Ações registradas
- Criação de reserva
- Aprovação
- Recusa
- Cancelamento

### 5.3 Dados registrados
- Usuário responsável pela ação
- Reserva associada
- Status da ação
- Descrição da ação
- Data automática da alteração

### 5.4 Permissões
- ADMIN visualiza todos os históricos
- USUÁRIO visualiza apenas seus próprios históricos

---

## 6. Segurança do Sistema

- Autenticação via JWT obrigatória
- Acesso restrito a usuários autenticados
- Validação de permissões em todas as operações críticas
- Mensagens de erro genéricas em autenticação
- Proteção contra acesso indevido por perfil

---

## 7. Consistência de Dados

- Reservas não podem ter datas inválidas
- Reserva depende de usuário e espaço válidos
- Histórico depende de reserva e usuário
- Status são controlados por enums
- Não pode existir sobreposição de reservas ativas no mesmo espaço

---

## 8. Melhorias Futuras

- Paginação de listas
- Soft delete
- Middleware de autenticação (RBAC)
- DTOs com validação
- Transações no banco
- Controle de concorrência em reservas
- Limite de reservas por usuário
- Refresh token