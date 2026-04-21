"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const joi_1 = __importDefault(require("joi"));
const AuthService_1 = require("../services/AuthService");
const logger_1 = require("../utils/logger");
const service = new AuthService_1.AuthService();
// Validation schemas
const loginSchema = joi_1.default.object({
    login: joi_1.default.string().min(3).max(50).required(),
    senha: joi_1.default.string().min(6).required()
});
const registerSchema = joi_1.default.object({
    login: joi_1.default.string().min(3).max(50).required(),
    senha: joi_1.default.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)')).required(),
    nome: joi_1.default.string().min(2).max(100).required(),
    email: joi_1.default.string().email().required(),
    perfil: joi_1.default.string().valid('admin', 'usuario').optional().default('usuario')
});
class AuthController {
    async login(req, res) {
        try {
            const { error, value } = loginSchema.validate(req.body);
            if (error) {
                logger_1.logger.warn('Tentativa de login com dados inválidos', { ip: req.ip, userAgent: req.get('User-Agent'), details: error.details[0].message });
                return res.status(400).json({ message: "Dados inválidos", details: error.details[0].message });
            }
            const { login, senha } = value;
            const resultado = await service.login(login, senha);
            logger_1.logger.info('Login bem-sucedido', { userId: resultado.usuario.id, login, ip: req.ip });
            return res.json(resultado);
        }
        catch (err) {
            logger_1.logger.warn('Falha no login', { login: req.body.login, ip: req.ip, error: err.message });
            return res.status(401).json({ message: err.message });
        }
    }
    async registrar(req, res) {
        try {
            const { error, value } = registerSchema.validate(req.body);
            if (error) {
                logger_1.logger.warn('Tentativa de registro com dados inválidos', { ip: req.ip, userAgent: req.get('User-Agent'), details: error.details[0].message });
                return res.status(400).json({ message: "Dados inválidos", details: error.details[0].message });
            }
            const usuario = await service.registrar(value);
            logger_1.logger.info('Usuário registrado', { userId: usuario.id, login: value.login, perfil: value.perfil, ip: req.ip });
            return res.status(201).json({ id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil });
        }
        catch (err) {
            logger_1.logger.error('Erro no registro', { login: req.body.login, ip: req.ip, error: err.message });
            return res.status(400).json({ message: err.message });
        }
    }
}
exports.AuthController = AuthController;
