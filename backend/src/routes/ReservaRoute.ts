import { Router } from "express";
import { ReservaController } from "../controllers/ReservaController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const controller = new ReservaController();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Reservas
 *   description: Sistema completo de gerenciamento de reservas de espaços
 */

/**
 * @swagger
 * /reservas:
 *   get:
 *     summary: Lista reservas
 *     description: Retorna todas as reservas. ADMIN vê tudo, usuário vê apenas as próprias.
 *     tags: [Reservas]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Lista de reservas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                     example: 1
 *                   status:
 *                     type: string
 *                     example: PENDENTE
 *                   dataInicio:
 *                     type: string
 *                     example: 2026-05-20T08:00:00.000Z
 *                   dataFim:
 *                     type: string
 *                     example: 2026-05-20T10:00:00.000Z
 *
 *       401:
 *         description: Não autorizado
 */
router.get("/", controller.listarReservas.bind(controller));



/**
 * @swagger
 * /reservas/{id}:
 *   get:
 *     summary: Buscar reserva por ID
 *     description: Retorna uma reserva específica do sistema
 *     tags: [Reservas]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da reserva
 *         schema:
 *           type: integer
 *           example: 1
 *
 *     responses:
 *       200:
 *         description: Reserva encontrada com sucesso
 *
 *       404:
 *         description: Reserva não encontrada
 *
 *       401:
 *         description: Não autorizado
 */
router.get("/:id", controller.buscarReservas.bind(controller));



/**
 * @swagger
 * /reservas:
 *   post:
 *     summary: Criar reserva
 *     description: Cria uma nova reserva de espaço no sistema
 *     tags: [Reservas]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - espacoId
 *               - dataInicio
 *               - dataFim
 *             properties:
 *               espacoId:
 *                 type: number
 *                 example: 1
 *               dataInicio:
 *                 type: string
 *                 example: 2026-05-20T08:00:00.000Z
 *               dataFim:
 *                 type: string
 *                 example: 2026-05-20T10:00:00.000Z
 *               descricao:
 *                 type: string
 *                 example: Aula de programação
 *
 *     responses:
 *       201:
 *         description: Reserva criada com sucesso
 *
 *       400:
 *         description: Erro de validação
 *
 *       401:
 *         description: Não autorizado
 */
router.post("/", controller.criar.bind(controller));



/**
 * @swagger
 * /reservas/{id}/aprovar:
 *   patch:
 *     summary: Aprovar reserva
 *     description: Aprova uma reserva pendente (apenas ADMIN)
 *     tags: [Reservas]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *
 *     responses:
 *       200:
 *         description: Reserva aprovada com sucesso
 *
 *       400:
 *         description: Erro ao aprovar
 *
 *       401:
 *         description: Não autorizado
 */
router.patch("/:id/aprovar", controller.aprovarReserva.bind(controller));



/**
 * @swagger
 * /reservas/{id}/recusar:
 *   patch:
 *     summary: Recusar reserva
 *     description: Recusa uma reserva pendente com motivo (apenas ADMIN)
 *     tags: [Reservas]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - motivo
 *             properties:
 *               motivo:
 *                 type: string
 *                 example: Espaço indisponível no horário
 *
 *     responses:
 *       200:
 *         description: Reserva recusada com sucesso
 *
 *       400:
 *         description: Erro ao recusar
 *
 *       401:
 *         description: Não autorizado
 */
router.patch("/:id/recusar", controller.recusarReserva.bind(controller));



/**
 * @swagger
 * /reservas/{id}/cancelar:
 *   patch:
 *     summary: Cancelar reserva
 *     description: Cancela uma reserva existente (usuário dono ou admin)
 *     tags: [Reservas]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *
 *     responses:
 *       200:
 *         description: Reserva cancelada com sucesso
 *
 *       400:
 *         description: Erro ao cancelar
 *
 *       401:
 *         description: Não autorizado
 */
router.patch("/:id/cancelar", controller.cancelarReserva.bind(controller));



/**
 * @swagger
 * /reservas/{id}/log:
 *   get:
 *     summary: Histórico da reserva
 *     description: Retorna o log interno da reserva (criação, aprovação, cancelamento etc.)
 *     tags: [Reservas]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *
 *     responses:
 *       200:
 *         description: Log retornado com sucesso
 *
 *       404:
 *         description: Reserva não encontrada
 */
router.get("/:id/log", controller.obterLog.bind(controller));



/**
 * @swagger
 * /reservas/historico/periodo:
 *   get:
 *     summary: Histórico por período
 *     description: Lista reservas filtradas por intervalo de datas (ADMIN vê tudo, usuário vê apenas suas)
 *     tags: [Reservas]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: query
 *         name: inicio
 *         required: true
 *         schema:
 *           type: string
 *           example: 2026-05-01T00:00:00.000Z
 *
 *       - in: query
 *         name: fim
 *         required: true
 *         schema:
 *           type: string
 *           example: 2026-05-30T23:59:59.000Z
 *
 *     responses:
 *       200:
 *         description: Histórico retornado com sucesso
 *
 *       400:
 *         description: Datas inválidas
 */
router.get(
  "/historico/periodo",
  controller.historicoPeriodo.bind(controller)
);

export default router;