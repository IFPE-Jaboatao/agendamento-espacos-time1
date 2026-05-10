// swaggerRoutes.ts

import { Router } from "express";

import { AuthController } from "../controllers/AuthController";
import { ReservaController } from "../controllers/ReservaController";
import { EspacoController } from "../controllers/EspacoController";
import { UsuarioController } from "../controllers/UsuarioController";
import { HistoricoReservaController } from "../controllers/HistoricoReservaController";

const router = Router();

const authController = new AuthController();
const reservaController = new ReservaController();
const espacoController = new EspacoController();
const usuarioController = new UsuarioController();
const historicoReservaController = new HistoricoReservaController();

// ======================================================
// AUTH
// ======================================================

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza login no sistema
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - login
 *               - senha
 *             properties:
 *               login:
 *                 type: string
 *                 example: admin
 *               senha:
 *                 type: string
 *                 example: Admin123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Usuário ou senha inválidos
 */
router.post(
  "/auth/login",
  authController.login.bind(authController)
);

/**
 * @swagger
 * /auth/registrar:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - login
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Rafael Borges
 *               login:
 *                 type: string
 *                 example: rafael
 *               email:
 *                 type: string
 *                 example: rafael@email.com
 *               senha:
 *                 type: string
 *                 example: Admin123
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 */
router.post(
  "/auth/registrar",
  authController.registrar.bind(authController)
);

// ======================================================
// RESERVAS
// ======================================================

/**
 * @swagger
 * /reservas:
 *   get:
 *     summary: Lista todas as reservas
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: Lista de reservas retornada com sucesso
 */
router.get(
  "/reservas",
  reservaController.listar.bind(reservaController)
);

/**
 * @swagger
 * /reservas/{id}:
 *   get:
 *     summary: Buscar reserva por ID
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reserva encontrada
 *       404:
 *         description: Reserva não encontrada
 */
router.get(
  "/reservas/:id",
  reservaController.buscarPorId.bind(reservaController)
);

/**
 * @swagger
 * /reservas:
 *   post:
 *     summary: Criar nova reserva
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - espacoId
 *               - solicitanteId
 *               - dataInicio
 *               - dataFim
 *             properties:
 *               espacoId:
 *                 type: integer
 *                 example: 1
 *               solicitanteId:
 *                 type: integer
 *                 example: 2
 *               dataInicio:
 *                 type: string
 *                 format: date-time
 *               dataFim:
 *                 type: string
 *                 format: date-time
 *               descricao:
 *                 type: string
 *                 example: Aula prática
 *     responses:
 *       201:
 *         description: Reserva criada com sucesso
 */
router.post(
  "/reservas",
  reservaController.criar.bind(reservaController)
);

/**
 * @swagger
 * /reservas/{id}:
 *   put:
 *     summary: Atualizar reserva
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reserva atualizada
 */
router.put(
  "/reservas/:id",
  reservaController.atualizar.bind(reservaController)
);

/**
 * @swagger
 * /reservas/{id}:
 *   delete:
 *     summary: Cancelar reserva
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Reserva cancelada com sucesso
 */
router.delete(
  "/reservas/:id",
  reservaController.cancelar.bind(reservaController)
);

// ======================================================
// ESPAÇOS
// ======================================================

/**
 * @swagger
 * /espacos:
 *   get:
 *     summary: Lista todos os espaços
 *     tags: [Espacos]
 *     responses:
 *       200:
 *         description: Lista de espaços retornada com sucesso
 */
router.get(
  "/espacos",
  espacoController.listar.bind(espacoController)
);

/**
 * @swagger
 * /espacos/{id}:
 *   get:
 *     summary: Buscar espaço por ID
 *     tags: [Espacos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Espaço encontrado
 */
router.get(
  "/espacos/:id",
  espacoController.buscarPorId.bind(espacoController)
);

/**
 * @swagger
 * /espacos:
 *   post:
 *     summary: Criar novo espaço
 *     tags: [Espacos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Laboratório 01
 *               descricao:
 *                 type: string
 *                 example: Laboratório de informática
 *               capacidade:
 *                 type: integer
 *                 example: 40
 *               status:
 *                 type: string
 *                 example: ativo
 *     responses:
 *       201:
 *         description: Espaço criado com sucesso
 */
router.post(
  "/espacos",
  espacoController.criar.bind(espacoController)
);

/**
 * @swagger
 * /espacos/{id}:
 *   put:
 *     summary: Atualizar espaço
 *     tags: [Espacos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Espaço atualizado
 */
router.put(
  "/espacos/:id",
  espacoController.atualizar.bind(espacoController)
);

/**
 * @swagger
 * /espacos/{id}:
 *   delete:
 *     summary: Deletar espaço
 *     tags: [Espacos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Espaço deletado
 */
router.delete(
  "/espacos/:id",
  espacoController.deletar.bind(espacoController)
);

// ======================================================
// USUÁRIOS
// ======================================================

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 */
router.get(
  "/usuarios",
  usuarioController.listar.bind(usuarioController)
);

// ======================================================
// HISTÓRICOS
// ======================================================

/**
 * @swagger
 * /historicos:
 *   get:
 *     summary: Lista histórico de reservas
 *     tags: [Historicos]
 *     responses:
 *       200:
 *         description: Lista de históricos retornada com sucesso
 */
router.get(
  "/historicos",
  historicoReservaController.listar.bind(historicoReservaController)
);

/**
 * @swagger
 * /historicos/{id}:
 *   get:
 *     summary: Buscar histórico por ID
 *     tags: [Historicos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Histórico encontrado
 */
router.get(
  "/historicos/:id",
  historicoReservaController.buscarPorId.bind(historicoReservaController)
);

/**
 * @swagger
 * /historicos:
 *   post:
 *     summary: Criar entrada no histórico
 *     tags: [Historicos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reservaId
 *               - usuarioId
 *               - status
 *             properties:
 *               reservaId:
 *                 type: integer
 *                 example: 1
 *               usuarioId:
 *                 type: integer
 *                 example: 2
 *               status:
 *                 type: string
 *                 example: cancelada
 *               descricao:
 *                 type: string
 *                 example: Reserva cancelada pelo usuário
 *     responses:
 *       201:
 *         description: Histórico criado com sucesso
 */
router.post(
  "/historicos",
  historicoReservaController.criar.bind(historicoReservaController)
);

/**
 * @swagger
 * /historicos/{id}:
 *   delete:
 *     summary: Deletar histórico
 *     tags: [Historicos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Histórico deletado
 */
router.delete(
  "/historicos/:id",
  historicoReservaController.deletar.bind(historicoReservaController)
);

export default router;