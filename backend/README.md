# 📦 API Node.js + TypeScript

Projeto backend construído com **Node.js + Express + TypeScript**, preparado para autenticação, banco de dados e boas práticas de segurança.

---

## Tecnologias utilizadas

* Node.js
* TypeScript
* Express
* dotenv
* nodemon / ts-node-dev
* MySQL (futuro)
* TypeORM (futuro)

---

## 📁 Estrutura do projeto

```
backend/
 ├── src/
 │   └── server.ts
 ├── node_modules/
 ├── package.json
 ├── package-lock.json
 ├── tsconfig.json
 ├── README.md
 ├── .gitignore
 └── frontend/ (opcional)
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

### 3. Criar arquivo de ambiente

Crie um arquivo chamado `.env` na raiz do backend:

```env
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

## 📜 Scripts disponíveis

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

## 📄 .gitignore (IMPORTANTE)

Crie um arquivo `.gitignore` dentro do backend com:

```gitignore
node_modules/
dist/
.env
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
  res.send("API rodando ");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
```

---

## Próximos passos do projeto

* [ ] Configurar TypeORM + MySQL
* [ ] Criar autenticação JWT
* [ ] Implementar bcrypt para senhas
* [ ] Criar estrutura MVC (controllers/services/routes)
* [ ] Adicionar validação com Joi
* [ ] Configurar logs com Winston
* [ ] Criar middleware de segurança (Helmet + CORS + Rate Limit)

---

## Observações importantes

* Nunca subir `node_modules` para o Git
* Nunca subir `.env` (contém dados sensíveis)
* Use sempre `npm install` para recriar dependências
* Use `npm