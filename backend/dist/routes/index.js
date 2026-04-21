"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const usuarioRoutes_1 = __importDefault(require("./usuarioRoutes"));
const reservaRoutes_1 = __importDefault(require("./reservaRoutes"));
const espacoRoutes_1 = __importDefault(require("./espacoRoutes"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const perfilMiddleware_1 = require("../middlewares/perfilMiddleware");
const Usuario_1 = require("../entities/Usuario");
const router = (0, express_1.Router)();
const authController = new AuthController_1.AuthController();
// Rotas públicas
router.post("/auth/login", authController.login);
// Rotas protegidas
router.post("/auth/registrar", authMiddleware_1.autenticar, (0, perfilMiddleware_1.exigirPerfil)(Usuario_1.Perfil.ADMIN), authController.registrar);
router.use("/reservas", authMiddleware_1.autenticar, reservaRoutes_1.default);
router.use("/usuarios", authMiddleware_1.autenticar, (0, perfilMiddleware_1.exigirPerfil)(Usuario_1.Perfil.ADMIN), usuarioRoutes_1.default);
router.use("/espacos", authMiddleware_1.autenticar, espacoRoutes_1.default);
exports.default = router;
