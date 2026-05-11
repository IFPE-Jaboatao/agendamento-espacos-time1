import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

import { Usuario } from "./entities/Usuario";
import { Reserva } from "./entities/Reserva";
import { Espaco } from "./entities/Espaco";
import { HistoricoReserva } from "./entities/HistoricoReserva";

export const AppDataSource = new DataSource({
  type: "mysql",

  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT!),
  username: process.env.DB_USER!,
  password: process.env.DB_PASS!,
  database: process.env.DB_NAME!,

  entities: [
    Usuario,
    Reserva,
    Espaco,
    HistoricoReserva,
  ],

  migrations: [],

  synchronize: true,

  logging: process.env.DB_LOGGING === "true",

  charset: "utf8mb4",

  timezone: "Z",
});