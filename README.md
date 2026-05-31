# Sistema de Agendamento de Espaços Universitários

## Backend

Backend do sistema de agendamento de espaços desenvolvido com:

- Node.js
- Express
- TypeScript
- TypeORM
- MySQL
- JWT

O sistema permite:

- autenticação de usuários
- controle de permissões
- gerenciamento de espaços
- reservas
- histórico de ações
- documentação Swagger
- proteção de rotas
- controle de perfis

---

# Tecnologias Utilizadas

## Backend

- Node.js
- Express
- TypeScript
- TypeORM
- MySQL

## Segurança

- JWT
- bcrypt
- Helmet
- express-rate-limit

## Documentação

- Swagger UI Express
- Swagger JSDoc

## Utilitários

- dotenv
- cors
- winston
- joi

---

# Estrutura do Projeto

```txt
backend/
├── src/
│
├── controllers/
│   ├── AuthController.ts
│   ├── UsuarioController.ts
│   ├── EspacoController.ts
│   └── ReservaController.ts
│
├── services/
│   ├── AuthService.ts
│   ├── UsuarioService.ts
│   ├── EspacoService.ts
│   └── ReservaService.ts
│
├── routes/
│   ├── index.ts
│   ├── AuthRoute.ts
│   ├── UsuarioRoute.ts
│   ├── EspacoRoute.ts
│   └── ReservaRoute.ts
│
├── middlewares/
│   ├── authMiddleware.ts
│   └── adminMiddleware.ts
│
├── entities/
│   ├── Usuario.ts
│   ├── Espaco.ts
│   └── Reserva.ts
│
├── docs/
│   └── swagger.ts
│
├── @types/
│   └── express/
│       └── index.d.ts
│
├── utils/
│   └── PasswordUtil.ts
│
├── app.ts
├── server.ts
└── data-source.ts
│
├── package.json
├── tsconfig.json
├── .env
└── README.md
```

---

# Configuração do Projeto

## 1. Entrar na pasta backend

```bash
cd backend
```

---

## 2. Instalar dependências

```bash
npm install
```

---

# Configuração do .env

Crie um arquivo `.env` na raiz do backend:

```env
# =========================
# BANCO DE DADOS
# =========================

DB_HOST=localhost
DB_PORT=3306
DB_USER=seu_user
DB_PASS=sua_porta
DB_NAME=agenda_espacos

# =========================
# JWT
# =========================

JWT_SECRET=seu_token_secreto

# =========================
# SERVIDOR
# =========================

PORT=3000

# =========================
# LOGS
# =========================

DB_LOGGING=false
```

---

# Rodando o Projeto

## Desenvolvimento

```bash
npm run dev
```

---

## Build

```bash
npm run build
```

---

## Produção

```bash
npm start
```

---

# Endereço da API

```txt
http://localhost:3000
```

---

# Swagger da API

A API possui documentação interativa utilizando Swagger.

---

## Como acessar

Com o servidor rodando:

```bash
npm run dev
```

Acesse:

```txt
http://localhost:3000/docs
```

---

# O que o Swagger permite

- visualizar rotas
- testar endpoints
- enviar JSON
- visualizar responses
- autenticar com JWT
- documentar a API automaticamente

---

# Como testar rotas

## 1. Abrir uma rota

Exemplo:

```txt
POST /auth/login
```

---

## 2. Clicar em "Try it out"

---

## 3. Inserir o JSON

```json
{
  "login": "victor",
  "senha": "123456"
}
```

---

## 4. Clicar em "Execute"

---

# Como usar JWT no Swagger

Após realizar login:

```json
{
  "token": "SEU_TOKEN"
}
```

---

## 1. Clicar em "Authorize"

Botão no topo direito.

---

## 2. Inserir:

```txt
Bearer SEU_TOKEN
```

Exemplo:

```txt
Bearer eyJhbGciOiJIUzI1Ni...
```

---

## 3. Confirmar

Clique em:

```txt
Authorize
```

Agora as rotas protegidas funcionarão.

---

# Rotas da API

## Auth

| Método | Rota |
|---|---|
| POST | `/api/auth/login` |
| POST | `/api/auth/register` |

---

## Usuários

| Método | Rota |
|---|---|
| GET | `/api/usuarios` |
| GET | `/api/usuarios/:id` |
| POST | `/api/usuarios` |
| PUT | `/api/usuarios/:id` |
| DELETE | `/api/usuarios/:id` |

---

## Espaços

| Método | Rota |
|---|---|
| GET | `/api/espacos` |
| GET | `/api/espacos/:id` |
| POST | `/api/espacos` |
| PUT | `/api/espacos/:id` |
| DELETE | `/api/espacos/:id` |

---

## Reservas

| Método | Rota |
|---|---|
| GET | `/api/reservas` |
| GET | `/api/reservas/:id` |
| GET | `/api/reservas/:id/log` |
| GET | `/api/reservas/historico/periodo` |
| POST | `/api/reservas` |
| PATCH | `/api/reservas/:id/aprovar` |
| PATCH | `/api/reservas/:id/recusar` |
| PATCH | `/api/reservas/:id/cancelar` |

---

# Autenticação

O sistema utiliza:

- JWT
- Bearer Token

Exemplo:

```http
Authorization: Bearer SEU_TOKEN
```

---

# Perfis de Usuário

## ADMIN

Possui acesso total ao sistema.

---

## USUARIO

Pode:

- criar reservas
- visualizar espaços
- cancelar próprias reservas

Não pode:

- gerenciar usuários
- aprovar reservas
- acessar rotas administrativas

---

# Segurança

- Senhas criptografadas com bcrypt
- JWT para autenticação
- Middleware de autorização
- Controle de perfil
- Variáveis sensíveis no `.env`
- Helmet
- Rate Limiting

---

# Scripts Disponíveis

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

---

# Dependências Principais

## Produção

```bash
bcrypt
cors
dotenv
express
express-rate-limit
helmet
joi
jsonwebtoken
mysql2
reflect-metadata
swagger-jsdoc
swagger-ui-express
typeorm
winston
```

---

## Desenvolvimento

```bash
typescript
ts-node
nodemon
@types/express
@types/jsonwebtoken
@types/node
@types/swagger-jsdoc
@types/swagger-ui-express
```

---

# Melhorias Futuras

- Upload de imagens
- Logs avançados
- Testes automatizados
- Refresh Token
- CI/CD
- Testes unitários
- Cache
- Filas
- WebSockets