import { Router } from "express";
import { HistoricoReservaController } from "../controllers/HistoricoReservaController";

import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const controller = new HistoricoReservaController();

/**
 * TODAS AS ROTAS EXIGEM AUTENTICAÇÃO
 */
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Histórico
 *   description: Auditoria de reservas
 */

/**
 * @swagger
 * /historico:
 *   get:
 *     summary: Lista histórico do usuário
 *     tags: [Histórico]
 */
router.get(
  "/",
  controller.listar.bind(controller)
);

/**
 * @swagger
 * /historico/{id}:
 *   get:
 *     summary: Busca histórico por ID
 *     tags: [Histórico]
 */
router.get(
  "/:id",
  controller.buscar.bind(controller)
);

/**
 * @swagger
 * /historico/{id}:
 *   delete:
 *     summary: Remove histórico (ADMIN)
 *     tags: [Histórico]
 */
router.delete(
  "/:id",
  controller.deletar.bind(controller)
);

export default router;