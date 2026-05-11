import { AppDataSource } from "./data-source";
import { AuthService } from "./services/AuthService";

async function run() {
  await AppDataSource.initialize();

  const auth = new AuthService();

  const result = await auth.registrar({
    nome: "Teste",
    email: "teste@email.com",
    login: "teste",
    senha: "123456"
  });

  console.log("Usuário criado:", result);

  const login = await auth.login("teste", "123456");

  console.log("Login:", login);
}

run();