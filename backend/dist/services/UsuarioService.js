"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioService = void 0;
const data_source_1 = require("../data-source");
const Usuario_1 = require("../entities/Usuario");
const bcrypt_1 = __importDefault(require("bcrypt"));
const repo = data_source_1.AppDataSource.getRepository(Usuario_1.Usuario);
class UsuarioService {
    async listarTodos() {
        return repo.find({ select: ["id", "nome", "login", "email", "perfil", "criadoEm"] });
    }
    async buscarPorId(id) {
        return repo.findOne({ where: { id }, select: ["id", "nome", "login", "email", "perfil", "criadoEm"] });
    }
    async atualizar(id, dados) {
        if (dados.senha)
            dados.senha = await bcrypt_1.default.hash(dados.senha, 10);
        await repo.update(id, dados);
        return this.buscarPorId(id);
    }
    async deletar(id) {
        await repo.delete(id);
    }
}
exports.UsuarioService = UsuarioService;
