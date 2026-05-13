import express from "express";
import routes from "./routes";

const app = express();

/**
 * Middleware global
 */
app.use(express.json());

/**
 * Rota raiz
 */
app.get("/", (req, res) => {
  return res.send("API rodando");
});

/**
 * Rotas da aplicação
 */
app.use("/api", routes);

export default app;