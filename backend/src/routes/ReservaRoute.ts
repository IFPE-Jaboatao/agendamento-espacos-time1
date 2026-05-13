import { Router } from "express";
import { ReservaController } from "../controllers/ReservaController";

import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const controller = new ReservaController();

/**
 * TODAS AS ROTAS DE RESERVA
 * EXIGEM AUTENTICAÇÃO
 */
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Reservas
 *   description: Gerenciamento de reservas
 */

/**
 * @swagger
 * /reservas:
 *   get:
 *     summary: Lista reservas
 *     tags: [Reservas]
 */
router.get(
  "/",
  controller.listar.bind(controller)
);

/**
 * @swagger
 * /reservas/{id}:
 *   get:
 *     summary: Busca reserva por ID
 *     tags: [Reservas]
 */
router.get(
  "/:id",
  controller.buscar.bind(controller)
);

/**
 * @swagger
 * /reservas:
 *   post:
 *     summary: Cria nova reserva
 *     tags: [Reservas]
 */
router.post(
  "/",
  controller.criar.bind(controller)
);

/**
 * @swagger
 * /reservas/{id}/aprovar:
 *   patch:
 *     summary: Aprova reserva (ADMIN)
 *     tags: [Reservas]
 */
router.patch(
  "/:id/aprovar",
  controller.aprovar.bind(controller)
);

/**
 * @swagger
 * /reservas/{id}/recusar:
 *   patch:
 *     summary: Recusa reserva (ADMIN)
 *     tags: [Reservas]
 */
router.patch(
  "/:id/recusar",
  controller.recusar.bind(controller)
);

/**
 * @swagger
 * /reservas/{id}/cancelar:
 *   patch:
 *     summary: Cancela reserva
 *     tags: [Reservas]
 */
router.patch(
  "/:id/cancelar",
  controller.cancelar.bind(controller)
);

export default router;