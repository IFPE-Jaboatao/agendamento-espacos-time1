"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const EspacoController_1 = require("../controllers/EspacoController");
const perfilMiddleware_1 = require("../middlewares/perfilMiddleware");
const Usuario_1 = require("../entities/Usuario");
const router = (0, express_1.Router)();
const controller = new EspacoController_1.EspacoController();
router.get("/", controller.listar);
router.get("/:id", controller.buscarPorId);
router.post("/", (0, perfilMiddleware_1.exigirPerfil)(Usuario_1.Perfil.ADMIN), controller.criar); // só admin
router.put("/:id", (0, perfilMiddleware_1.exigirPerfil)(Usuario_1.Perfil.ADMIN), controller.atualizar); // só admin
router.delete("/:id", (0, perfilMiddleware_1.exigirPerfil)(Usuario_1.Perfil.ADMIN), controller.deletar); // só admin
exports.default = router;
