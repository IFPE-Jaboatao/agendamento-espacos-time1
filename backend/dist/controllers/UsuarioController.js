"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioController = void 0;
const UsuarioService_1 = require("../services/UsuarioService");
const service = new UsuarioService_1.UsuarioService();
class UsuarioController {
    async listar(req, res) {
        return res.json(await service.listarTodos());
    }
    async buscarPorId(req, res) {
        const usuario = await service.buscarPorId(Number(req.params.id));
        if (!usuario)
            return res.status(404).json({ message: "Usuário não encontrado" });
        return res.json(usuario);
    }
    async atualizar(req, res) {
        const usuario = await service.atualizar(Number(req.params.id), req.body);
        return res.json(usuario);
    }
    async deletar(req, res) {
        await service.deletar(Number(req.params.id));
        return res.status(204).send();
    }
}
exports.UsuarioController = UsuarioController;
