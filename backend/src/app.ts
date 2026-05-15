import express from "express";
import cors from "cors";

import swaggerUi from "swagger-ui-express";

import routes from "./routes";
import { swaggerSpec } from "./docs/swagger";

const app = express();


// CORS

app.use(cors());


// Middleware global

app.use(express.json());


// Swagger

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);


// Rota raiz

app.get("/", (req, res) => {
  return res.send("API rodando");
});


// Rotas da aplicação

app.use("/api", routes);

export default app;