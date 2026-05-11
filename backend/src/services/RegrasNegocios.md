# 📌 Regras de Negócio - Sistema de Reservas

---

## 1. Autenticação e Usuários

### 1.1 Login
- Usuário deve existir no sistema
- Senha deve ser válida (comparação com hash)
- Login inválido bloqueia acesso

### 1.2 Segurança
- Senhas são armazenadas com hash
- Senhas nunca são retornadas nas respostas
- Autenticação via JWT

### 1.3 Token
- Token JWT expira em 8 horas

### 1.4 Cadastro
- Email deve ser único
- Login deve ser único
- Usuário padrão recebe perfil `USUARIO`

---

## 2. Perfis e Permissões

### 2.1 ADMIN
- Gerencia usuários
- Visualiza todas as reservas
- Visualiza todos os históricos
- Cria, edita e remove espaços
- Aprova e recusa reservas

### 2.2 USUÁRIO
- Acessa apenas seus dados
- Visualiza apenas suas reservas
- Visualiza apenas seus históricos
- Pode criar reservas
- Pode cancelar próprias reservas

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

---

## 4. Reservas

### 4.1 Criação
- Data início e fim obrigatórias
- Data final deve ser maior que inicial
- Não permite datas no passado
- Espaço deve existir
- Espaço deve estar ativo

### 4.2 Conflito de horário
- Não pode existir reserva sobreposta no mesmo espaço

### 4.3 Status
- Toda reserva inicia como `PENDENTE`
- Pode evoluir para:
  - APROVADA
  - RECUSADA
  - CANCELADA

### 4.4 Cancelamento
- Usuário pode cancelar sua própria reserva
- ADMIN pode cancelar qualquer reserva
- Reserva já cancelada não pode ser cancelada novamente

### 4.5 Aprovação e Recusa
- Apenas ADMIN pode aprovar ou recusar
- Reserva cancelada não pode ser alterada
- Recusa exige motivo obrigatório

---

## 5. Histórico (Auditoria)

### 5.1 Regra geral
- Toda ação relevante gera histórico automático

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
- Validação de permissões obrigatória em operações críticas

---

## 7. Consistência de Dados

- Reserva não pode ter datas inválidas
- Reserva depende de usuário e espaço
- Histórico depende de reserva e usuário
- Status inválidos não são permitidos

---

## 8. Melhorias Futuras

- Paginação de listas
- Soft delete
- Middleware central de autenticação (RBAC)
- DTOs com validação
- Transações no banco
- Melhor verificação de conflito de horários
- Limite de reservas por usuário