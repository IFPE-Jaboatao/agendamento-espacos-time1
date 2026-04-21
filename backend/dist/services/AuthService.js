"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const data_source_1 = require("../data-source");
const Usuario_1 = require("../entities/Usuario");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const repo = data_source_1.AppDataSource.getRepository(Usuario_1.Usuario);
class AuthService {
    async login(login, senha) {
        const usuario = await repo.findOne({ where: { login } });
        if (!usuario)
            throw new Error("Usuário não encontrado");
        const senhaValida = await bcrypt_1.default.compare(senha, usuario.senha);
        if (!senhaValida)
            throw new Error("Senha incorreta");
        const token = jsonwebtoken_1.default.sign({ id: usuario.id, perfil: usuario.perfil }, process.env.JWT_SECRET, { expiresIn: "8h" });
        return { token, usuario: { id: usuario.id, nome: usuario.nome, perfil: usuario.perfil } };
    }
    async registrar(dados) {
        const senhaHash = await bcrypt_1.default.hash(dados.senha, 10);
        const usuario = repo.create({ ...dados, senha: senhaHash });
        return repo.save(usuario);
    }
}
exports.AuthService = AuthService;
