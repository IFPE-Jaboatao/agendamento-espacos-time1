# Regras de Negócio - Sistema de Agendamento e Gestão de Espaços

---

## 1. Autenticação e Usuários

### 1.1 Login
- Usuário deve existir no sistema
- Senha deve ser válida (comparação com hash)
- Login inválido bloqueia acesso (mensagem genérica por segurança)

### 1.2 Segurança
- Senhas são armazenadas com hash
- Senhas nunca são retornadas nas respostas
- Autenticação via JWT obrigatória

### 1.3 Token
- Token JWT expira em **8 horas**

### 1.4 Cadastro
- Email deve ser único
- Login deve ser único
- Perfil sempre é definido como `USUARIO` no cadastro (não pode ser definido pelo cliente)

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
- Acessa apenas seus dados
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
- ativo
- inativo

### 3.3 Regras
- Apenas espaços ativos podem ser reservados
- Apenas ADMIN pode gerenciar espaços
- Espaços com reservas vinculadas não podem ser removidos

---

## 4. Reservas

### 4.1 Criação
- Data início e fim são obrigatórias
- Data final deve ser maior que a inicial
- Não permite datas no passado
- Espaço deve existir
- Espaço deve estar ativo

### 4.2 Conflito de horário
- Não pode existir reserva sobreposta no mesmo espaço

### 4.3 Status
- Toda reserva inicia como `PENDENTE`
- Pode evoluir para:
  - `APROVADA`
  - `RECUSADA`
  - `CANCELADA`

> Reservas só podem ser aprovadas ou recusadas se estiverem `PENDENTES`

---

### 4.4 Cancelamento
- Usuário pode cancelar sua própria reserva
- ADMIN pode cancelar qualquer reserva
- Reserva já cancelada não pode ser cancelada novamente
- Reservas canceladas não podem ser aprovadas ou recusadas

---

### 4.5 Aprovação e Recusa
- Apenas ADMIN pode aprovar ou recusar
- Recusa exige motivo obrigatório
- Reservas já processadas não podem ser alteradas novamente

---

## 5. Histórico (Auditoria)

### 5.1 Regra geral
- Toda ação relevante gera histórico automaticamente

### 5.2 Ações registradas
- Criação de reserva
- Aprovação
- Recusa
- Cancelamento

### 5.3 Dados registrados
- Usuário responsável
- Reserva associada
- Status da ação
- Descrição
- Data automática

### 5.4 Permissões
- ADMIN visualiza todos os históricos
- USUÁRIO visualiza apenas os seus

---

## 6. Segurança do Sistema

- Autenticação via JWT obrigatória
- Acesso restrito a usuários autenticados
- Validação de permissões obrigatória em todas as operações críticas
- Mensagens de erro genéricas para login (evitar enumeração de usuários)

---

## 7. Consistência de Dados

- Reserva não pode ter datas inválidas
- Reserva depende de usuário e espaço
- Histórico depende de reserva e usuário
- Status inválidos são controlados via enum
- Não há duplicidade de reservas no mesmo horário

---

## 8. Melhorias Futuras

- Paginação de listas
- Soft delete
- Middleware central de autenticação (RBAC)
- DTOs com validação (class-validator)
- Transações no banco
- Melhoria de concorrência no conflito de horários (lock/constraint)
- Limite de reservas por usuário
- Sistema de refresh token