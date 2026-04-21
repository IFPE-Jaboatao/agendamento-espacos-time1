"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservaController = void 0;
const ReservaService_1 = require("../services/ReservaService");
const service = new ReservaService_1.ReservaService();
class ReservaController {
    async listar(req, res) {
        const reservas = await service.listarTodas();
        return res.json(reservas);
    }
    async buscarPorId(req, res) {
        const { id } = req.params;
        const reserva = await service.buscarPorId(Number(id));
        if (!reserva)
            return res.status(404).json({ message: "Reserva não encontrada" });
        return res.json(reserva);
    }
    async criar(req, res) {
        const reserva = await service.criar(req.body);
        return res.status(201).json(reserva);
    }
    async atualizar(req, res) {
        const { id } = req.params;
        const reserva = await service.atualizar(Number(id), req.body);
        return res.json(reserva);
    }
    async cancelar(req, res) {
        const { id } = req.params;
        await service.cancelar(Number(id));
        return res.status(204).send();
    }
}
exports.ReservaController = ReservaController;
