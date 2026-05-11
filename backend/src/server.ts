import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API rodando");
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // conexão REAL com o banco
    await AppDataSource.initialize();

    console.log("Banco conectado com sucesso");

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Erro ao conectar no banco:");
      console.error(error.message);
    } else {
      console.error("Erro desconhecido:", error);
    }

    process.exit(1);
  }
}

startServer();