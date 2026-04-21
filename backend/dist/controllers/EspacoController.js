"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EspacoController = void 0;
const EspacoService_1 = require("../services/EspacoService");
const service = new EspacoService_1.EspacoService();
class EspacoController {
    async listar(req, res) {
        return res.json(await service.listarTodos());
    }
    async buscarPorId(req, res) {
        const espaco = await service.buscarPorId(Number(req.params.id));
        if (!espaco)
            return res.status(404).json({ message: "Espaço não encontrado" });
        return res.json(espaco);
    }
    async criar(req, res) {
        const espaco = await service.criar(req.body);
        return res.status(201).json(espaco);
    }
    async atualizar(req, res) {
        const espaco = await service.atualizar(Number(req.params.id), req.body);
        return res.json(espaco);
    }
    async deletar(req, res) {
        await service.deletar(Number(req.params.id));
        return res.status(204).send();
    }
}
exports.EspacoController = EspacoController;
