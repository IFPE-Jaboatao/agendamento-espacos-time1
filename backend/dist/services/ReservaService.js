"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservaService = void 0;
const data_source_1 = require("../data-source");
const Reserva_1 = require("../entities/Reserva");
const repo = data_source_1.AppDataSource.getRepository(Reserva_1.Reserva);
class ReservaService {
    async listarTodas() {
        return repo.find({ relations: ["solicitante", "espaco"] });
    }
    async buscarPorId(id) {
        return repo.findOne({ where: { id }, relations: ["solicitante", "espaco", "historicos"] });
    }
    async criar(dados) {
        const reserva = repo.create(dados);
        return repo.save(reserva);
    }
    async atualizar(id, dados) {
        await repo.update(id, dados);
        return this.buscarPorId(id);
    }
    async cancelar(id) {
        await repo.update(id, { status: Reserva_1.StatusReserva.CANCELADA });
    }
}
exports.ReservaService = ReservaService;
