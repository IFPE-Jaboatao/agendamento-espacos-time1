"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exigirPerfil = exigirPerfil;
function exigirPerfil(...perfis) {
    return (req, res, next) => {
        if (!req.usuario || !perfis.includes(req.usuario.perfil)) {
            return res.status(403).json({ message: "Acesso negado" });
        }
        next();
    };
}
