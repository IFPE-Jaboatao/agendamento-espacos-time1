# Sistema de Agendamento de Espaços

Sistema web completo para gerenciamento e agendamento de espaços, permitindo que usuários realizem reservas de forma prática, segura e organizada.

---

## Descrição

Este projeto consiste em uma aplicação fullstack dividida em duas partes:

* **Backend**: API REST responsável por autenticação, regras de negócio e persistência de dados.
* **Frontend**: Interface web para interação com o usuário.

O sistema permite que usuários se cadastrem, façam login e gerenciem agendamentos de espaços.

---

## Tecnologias Utilizadas

### Backend

* Node.js
* Express
* TypeORM
* MySQL
* JSON Web Token (JWT)
* Bcrypt
* Joi
* Winston
* Helmet
* CORS
* Express Rate Limit

### Frontend

* React
* Vite
* React Router DOM
* Axios
* Tailwind CSS
* Flowbite React

---

## Estrutura do Projeto

```
/backend   -> API REST (servidor)
/frontend  -> Interface do usuário (cliente)
```

---

## Funcionalidades

### Autenticação

* Cadastro de usuários
* Login com geração de token JWT
* Proteção de rotas autenticadas

### Agendamentos

* Criar agendamentos
* Listar agendamentos
* Cancelar agendamentos
* Validação de dados de entrada

### Segurança

* Senhas criptografadas com bcrypt
* Proteção de headers com Helmet
* Controle de requisições (rate limit)
* Validação de dados com Joi

---

## Pré-requisitos

Antes de rodar o projeto, você precisa ter instalado:

* Node.js (versão recomendada: 18+)
* MySQL
* Git

---

## Como rodar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/IFPE-Jaboatao/agendamento-espacos-time1.git
cd agendamento-espacos-time1
```

---

## Configuração do Backend

### Instalar dependências

```bash
cd backend
npm install
```

### Criar arquivo de ambiente

Crie um arquivo `.env` na pasta backend:

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=seu_banco

JWT_SECRET=sua_chave_secreta
```

### Rodar o servidor

```bash
npm run dev
```

O backend estará disponível em:

```
http://localhost:3000
```

---

## Configuração do Frontend

### Instalar dependências

```bash
cd frontend
npm install
```

### Rodar o projeto

```bash
npm run dev
```

O frontend estará disponível em:

```
http://localhost:5173
```

---

## Rotas da API

### Autenticação

```
POST /auth/register   -> Cadastro de usuário
POST /auth/login      -> Login
```

### Agendamentos

```
GET    /agendamentos        -> Listar agendamentos
POST   /agendamentos        -> Criar agendamento
DELETE /agendamentos/:id    -> Cancelar agendamento
```

---

## Modelo de Dados (em desenvolvimento)

### Usuário

```
id
nome
email
senha
created_at
```

### Agendamento

```
id
usuario_id
data
horario
espaco
created_at
```

---

## Logs

O sistema utiliza o Winston para registro de logs, permitindo:

* Monitoramento de erros
* Registro de requisições
* Debug em ambiente de desenvolvimento

---

## Boas Práticas Aplicadas

* Separação de responsabilidades (Controller, Service, Repository)
* Uso de variáveis de ambiente
* Validação de dados antes de persistir
* Criptografia de dados sensíveis
* Estrutura modular

---

## Autores

Emanuel Bento da Silva
Rafael Reis Borges da Silva
Victor Gabryel da 

---

## Licença

Este projeto está sob a licença MIT. Sinta-se livre para usar e modificar.