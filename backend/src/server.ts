import dotenv from "dotenv";
import app from "./app";
import { AppDataSource } from "./data-source";
import { ReservaService } from "./services/ReservaService";

dotenv.config();

const PORT = process.env.PORT;

if (!PORT) {
  throw new Error("PORT não configurada no .env");
}

async function startServer() {

  try {

    await AppDataSource.initialize();

    console.log("Banco conectado com sucesso");

    // INICIA SCHEDULER AQUI
    const reservaService = new ReservaService();
    reservaService.iniciarScheduler();

    app.listen(Number(PORT), "0.0.0.0", () => {
      console.log(
        // `Servidor rodando em http://0.0.0.0:${PORT}`
        `Servidor rodando em http://localhost:${PORT}`
      );
    });

  } catch (error: unknown) {

    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }

    process.exit(1);
  }
}

startServer();