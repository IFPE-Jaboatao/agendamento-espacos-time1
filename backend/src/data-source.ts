import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

// Carrega variáveis de ambiente antes de qualquer coisa
dotenv.config();

// Importação das entidades do sistema
import { Usuario } from "./entities/Usuario";
import { Reserva } from "./entities/Reserva";
import { Espaco } from "./entities/Espaco";
import { HistoricoReserva } from "./entities/HistoricoReserva";

/**
 * DataSource principal do TypeORM
 * Responsável pela conexão com o banco e gerenciamento das entidades
 */
export const AppDataSource = new DataSource({

  /**
   * Tipo de banco de dados
   */
  type: "mysql",

  /**
   * Configurações seguras com fallback (evita crash se .env estiver incompleto)
   */
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "reservas",

  /**
   * Entidades do sistema
   * (mapeamento das tabelas do banco)
   */
  entities: [
    Usuario,
    Reserva,
    Espaco,
    HistoricoReserva
  ],

  /**
   * MIGRAÇÕES (preparado para evolução do projeto)
   * Mesmo que ainda não esteja usando, já fica estruturado
   */
  migrations: [],

  /**
   * NUNCA usar true em produção
   * true = altera banco automaticamente (perigoso)
   */
  synchronize: false,

  /**
   * Logs SQL (ativado via .env)
   */
  logging: process.env.DB_LOGGING === "true",

  /**
   * Charset para suportar acentos e emojis
   */
  charset: "utf8mb4",

  /**
   * Padronização de horário (evita bugs de timezone)
   */
  timezone: "Z"
});