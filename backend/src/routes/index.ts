import { Router } from "express";

import { AuthController } from "../controllers/AuthController";

import usuarioRoutes from "./usuarioRoutes";
import reservaRoutes from "./reservaRoutes";
import espacoRoutes from "./espacoRoutes";
import historicoReservaRoutes from "./HistoricoReservaRoutes";

import { autenticar } from "../middlewares/authMiddleware";
import { exigirPerfil } from "../middlewares/perfilMiddleware";

import { Perfil } from "../entities/Usuario";

const router = Router();
const authController = new AuthController();

// ================================
// ROTAS PÚBLICAS
// ================================

// Login do usuário
router.post(
  "/auth/login",
  authController.login.bind(authController)
);

// Registro de usuário
router.post(
  "/auth/registrar",
  authController.registrar.bind(authController)
);

// ================================
// ROTAS PROTEGIDAS
// ================================

// Rotas de usuários
// Apenas ADMIN pode acessar
router.use(
  "/usuarios",
  autenticar,
  exigirPerfil(Perfil.ADMIN),
  usuarioRoutes
);

// Rotas de reservas
// Qualquer usuário autenticado
router.use(
  "/reservas",
  autenticar,
  reservaRoutes
);

// Rotas de espaços
// Qualquer usuário autenticado
router.use(
  "/espacos",
  autenticar,
  espacoRoutes
);

// Rotas de histórico de reservas
// Apenas ADMIN pode acessar
router.use(
  "/historicos",
  autenticar,
  exigirPerfil(Perfil.ADMIN),
  historicoReservaRoutes
);

export default router;