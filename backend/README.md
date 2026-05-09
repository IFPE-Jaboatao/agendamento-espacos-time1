# Agendamento Espacos Time 1

Projeto backend construído com **Node.js + Express + TypeScript + TypeORM**, preparado para autenticação JWT, controle de reservas de espaços e histórico de ações.

---

## Tecnologias utilizadas

- Node.js
- TypeScript
- Express
- dotenv
- MySQL
- TypeORM
- bcrypt (senhas seguras)
- JWT (autenticação)

---

## Estrutura do projeto

```
backend/
 ├── src/
 │   ├── entities/
 │   │    ├── Usuario.ts
 │   │    ├── Reserva.ts
 │   │    ├── Espaco.ts
 │   │    ├── HistoricoReserva.ts
 │   │
 │   ├── services/
 │   │    ├── AuthService.ts
 │   │    ├── UsuarioService.ts
 │   │    ├── ReservaService.ts
 │   │    ├── EspacoService.ts
 │   │    ├── HistoricoReservaService.ts
 │   │
 │   ├── utils/
 │   │    └── PasswordUtil.ts
 │   │
 │   ├── data-source.ts
 │   └── server.ts
 │
 ├── node_modules/
 ├── package.json
 ├── tsconfig.json
 ├── .env
 ├── .gitignore
 └── README.md
```

---

## Como iniciar o projeto

### 1. Entrar na pasta do backend

```bash
cd backend
```

---

### 2. Instalar dependências

```bash
npm install
```

---

### 3. Configurar o arquivo `.env`

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=root
DB_NAME=agenda_espacos

JWT_SECRET=9f3c2a7b8d6e4f1c9a0d8b7e6f5c4a3d2b1e0f9c8a7b6d5c4

DB_LOGGING=false

PORT=3000
```

---

### 4. Rodar o projeto em desenvolvimento

```bash
npm run dev
```

---

### 5. Acessar no navegador

```
http://localhost:3000
```

---

## Scripts disponíveis

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

---

## .gitignore

```gitignore
node_modules/
dist/
# .env por enquanto comentado
*.log
.vscode/
.idea/
.DS_Store
```

---

## Código base do servidor

```ts
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API rodando");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
```

---

## Funcionalidades do sistema

### Usuários
- Criar usuário
- Login JWT
- Controle de perfil (admin / usuário)

### Espaços
- Criar espaços (sala, laboratório, auditório)
- Listar espaços ativos
- Atualizar e deletar

### Reservas
- Criar reservas de espaços
- Cancelar reservas
- Consultar reservas com relacionamentos

### Histórico de Reservas
- Registro automático de ações
- Auditoria de mudanças

---

## Segurança implementada

- Senhas criptografadas com bcrypt
- Autenticação JWT
- Não expõe senha no retorno
- Variáveis sensíveis via .env
- Controle de perfil

---

## Próximos passos

- Controllers
- Middleware JWT
- Validação
- Error handler global