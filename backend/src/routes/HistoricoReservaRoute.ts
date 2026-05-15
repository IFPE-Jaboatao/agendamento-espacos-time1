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
 *   description: Auditoria e histórico de reservas
 */

/**
 * @swagger
 * /historico:
 *   get:
 *     summary: Lista histórico do usuário autenticado
 *     description: Retorna o histórico de ações e reservas do usuário
 *     tags: [Histórico]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Histórico listado com sucesso
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
 *                   acao:
 *                     type: string
 *                     example: RESERVA_CRIADA
 *
 *                   descricao:
 *                     type: string
 *                     example: Reserva criada com sucesso
 *
 *                   criadoEm:
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
 * /historico/{id}:
 *   get:
 *     summary: Busca histórico por ID
 *     description: Retorna um registro específico do histórico
 *     tags: [Histórico]
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
 *         description: ID do histórico
 *
 *     responses:
 *       200:
 *         description: Histórico encontrado
 *
 *       401:
 *         description: Não autorizado
 *
 *       404:
 *         description: Histórico não encontrado
 */
router.get(
  "/:id",
  controller.buscar.bind(controller)
);

/**
 * @swagger
 * /historico/{id}:
 *   delete:
 *     summary: Remove um histórico
 *     description: Remove um registro do histórico do sistema
 *     tags: [Histórico]
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
 *         description: ID do histórico
 *
 *     responses:
 *       200:
 *         description: Histórico removido com sucesso
 *
 *       401:
 *         description: Não autorizado
 *
 *       404:
 *         description: Histórico não encontrado
 */
router.delete(
  "/:id",
  controller.deletar.bind(controller)
);

export default router;