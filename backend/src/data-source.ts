import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

// Carrega variáveis do .env ANTES de tudo
dotenv.config();

// Importação das entidades do sistema
import { Usuario } from "./entities/Usuario";
import { Reserva } from "./entities/Reserva";
import { Espaco } from "./entities/Espaco";
import { HistoricoReserva } from "./entities/HistoricoReserva";

/**
 * Configuração principal de conexão com o banco de dados
 * TypeORM usa isso para criar e gerenciar tabelas
 */
export const AppDataSource = new DataSource({

  // Tipo de banco utilizado
  type: "mysql",

  // Dados vindos do .env (evita hardcode)
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),

  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,

  // Entidades (tabelas do sistema)
  entities: [
    Usuario,
    Reserva,
    Espaco,
    HistoricoReserva
  ],

  // NUNCA usar true em produção
  // true = altera banco automaticamente (perigoso)
  synchronize: false,

  // Ativa logs SQL se DB_LOGGING=true no .env
  logging: process.env.DB_LOGGING === "true",

  // Suporte a acentos, emojis e caracteres especiais
  charset: "utf8mb4",

  // Padroniza horário como UTC (evita bugs de data)
  timezone: "Z"
});