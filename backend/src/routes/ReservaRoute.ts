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
 *   description: Gerenciamento de reservas de espaços
 */

/**
 * @swagger
 * /reservas:
 *   get:
 *     summary: Lista reservas
 *     description: Retorna todas as reservas do sistema
 *     tags: [Reservas]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Lista de reservas retornada com sucesso
 *
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *
 *               items:
 *                 type: object
 *
 *                 properties:
 *                   id:
 *                     type: number
 *
 *                   status:
 *                     type: string
 *                     example: PENDENTE
 *
 *                   dataInicio:
 *                     type: string
 *                     example: 2026-05-15T08:00:00.000Z
 *
 *                   dataFim:
 *                     type: string
 *                     example: 2026-05-15T10:00:00.000Z
 *
 *       401:
 *         description: Não autorizado
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
 *     description: Retorna os dados de uma reserva específica
 *     tags: [Reservas]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *
 *         schema:
 *           type: integer
 *
 *         description: ID da reserva
 *
 *     responses:
 *       200:
 *         description: Reserva encontrada
 *
 *       401:
 *         description: Não autorizado
 *
 *       404:
 *         description: Reserva não encontrada
 */
router.get(
  "/:id",
  controller.buscar.bind(controller)
);

/**
 * @swagger
 * /reservas:
 *   post:
 *     summary: Cria uma nova reserva
 *     description: Cria uma reserva para um espaço
 *     tags: [Reservas]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             required:
 *               - espacoId
 *               - dataInicio
 *               - dataFim
 *
 *             properties:
 *               espacoId:
 *                 type: number
 *                 example: 1
 *
 *               dataInicio:
 *                 type: string
 *                 example: 2026-05-20T08:00:00.000Z
 *
 *               dataFim:
 *                 type: string
 *                 example: 2026-05-20T10:00:00.000Z
 *
 *     responses:
 *       201:
 *         description: Reserva criada com sucesso
 *
 *       400:
 *         description: Dados inválidos
 *
 *       401:
 *         description: Não autorizado
 */
router.post(
  "/",
  controller.criar.bind(controller)
);

/**
 * @swagger
 * /reservas/{id}/aprovar:
 *   patch:
 *     summary: Aprova uma reserva
 *     description: Aprova uma reserva pendente
 *     tags: [Reservas]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *
 *         schema:
 *           type: integer
 *
 *         description: ID da reserva
 *
 *     responses:
 *       200:
 *         description: Reserva aprovada com sucesso
 *
 *       401:
 *         description: Não autorizado
 *
 *       404:
 *         description: Reserva não encontrada
 */
router.patch(
  "/:id/aprovar",
  controller.aprovar.bind(controller)
);

/**
 * @swagger
 * /reservas/{id}/recusar:
 *   patch:
 *     summary: Recusa uma reserva
 *     description: Recusa uma reserva pendente
 *     tags: [Reservas]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *
 *         schema:
 *           type: integer
 *
 *         description: ID da reserva
 *
 *     responses:
 *       200:
 *         description: Reserva recusada com sucesso
 *
 *       401:
 *         description: Não autorizado
 *
 *       404:
 *         description: Reserva não encontrada
 */
router.patch(
  "/:id/recusar",
  controller.recusar.bind(controller)
);

/**
 * @swagger
 * /reservas/{id}/cancelar:
 *   patch:
 *     summary: Cancela uma reserva
 *     description: Cancela uma reserva existente
 *     tags: [Reservas]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *
 *         schema:
 *           type: integer
 *
 *         description: ID da reserva
 *
 *     responses:
 *       200:
 *         description: Reserva cancelada com sucesso
 *
 *       401:
 *         description: Não autorizado
 *
 *       404:
 *         description: Reserva não encontrada
 */
router.patch(
  "/:id/cancelar",
  controller.cancelar.bind(controller)
);

export default router;