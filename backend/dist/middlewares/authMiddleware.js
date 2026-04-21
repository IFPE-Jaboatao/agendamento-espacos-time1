"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autenticar = autenticar;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = require("../utils/logger");
function autenticar(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token não fornecido ou formato inválido" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.usuario = payload;
        next();
    }
    catch (err) {
        if (err.name === "TokenExpiredError") {
            logger_1.logger.warn('Token expirado', { ip: req.ip, userAgent: req.get('User-Agent') });
            return res.status(401).json({ message: "Token expirado" });
        }
        else if (err.name === "JsonWebTokenError") {
            logger_1.logger.warn('Token inválido', { ip: req.ip, userAgent: req.get('User-Agent') });
            return res.status(401).json({ message: "Token inválido" });
        }
        else {
            logger_1.logger.error('Erro na verificação do token', { ip: req.ip, error: err.message });
            return res.status(401).json({ message: "Erro na autenticação" });
        }
    }
}
