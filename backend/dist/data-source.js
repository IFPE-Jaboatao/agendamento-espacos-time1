"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Usuario_1 = require("./entities/Usuario");
const Reserva_1 = require("./entities/Reserva");
const Espaco_1 = require("./entities/Espaco");
const HistoricoReserva_1 = require("./entities/HistoricoReserva");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "reservas_db",
    synchronize: true, // ⚠️ só em dev! Em prod use migrations
    logging: false,
    entities: [Usuario_1.Usuario, Reserva_1.Reserva, Espaco_1.Espaco, HistoricoReserva_1.HistoricoReserva],
});
