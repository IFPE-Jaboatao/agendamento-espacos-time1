import "reflect-metadata";
import { DataSource } from "typeorm";
import { Usuario } from "./entities/Usuario";
import { Reserva } from "./entities/Reserva";
import { Espaco } from "./entities/Espaco";
import { HistoricoReserva } from "./entities/HistoricoReserva";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "reservas_db",
  synchronize: true,
  logging: false,
  entities: [Usuario, Reserva, Espaco, HistoricoReserva],
});