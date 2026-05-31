import { Router } from "express";
import { EspacoController } from "../controllers/EspacoController";

import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const controller = new EspacoController();

/**
 * @swagger
 * tags:
 *   name: Espaços
 *   description: Gerenciamento de espaços do sistema
 */

/**
 * @swagger
 * /espacos:
 *   get:
 *     summary: Lista todos os espaços ativos
 *     description: Retorna todos os espaços cadastrados e ativos
 *     tags: [Espaços]
 *
 *     responses:
 *       200:
 *         description: Lista de espaços retornada com sucesso
 *
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *
 *                   nome:
 *                     type: string
 *                     example: Laboratório 01
 *
 *                   descricao:
 *                     type: string
 *                     example: Laboratório de informática
 *
 *                   capacidade:
 *                     type: number
 *                     example: 40
 *
 *                   ativo:
 *                     type: boolean
 *                     example: true
 */
router.get(
  "/",
  controller.listar.bind(controller)
);

/**
 * @swagger
 * /espacos/{id}:
 *   get:
 *     summary: Busca espaço por ID
 *     description: Retorna os dados de um espaço específico
 *     tags: [Espaços]
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *
 *         schema:
 *           type: integer
 *
 *         description: ID do espaço
 *
 *     responses:
 *       200:
 *         description: Espaço encontrado
 *
 *       404:
 *         description: Espaço não encontrado
 */
router.get(
  "/:id",
  controller.buscar.bind(controller)
);

/**
 * @swagger
 * /espacos:
 *   post:
 *     summary: Cria um novo espaço
 *     description: Rota protegida para criação de espaços
 *     tags: [Espaços]
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
 *               - nome
 *               - capacidade
 *               - tipo
 *
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Auditório Principal
 *
 *               descricao:
 *                 type: string
 *                 example: Espaço para palestras e eventos
 *
 *               capacidade:
 *                 type: number
 *                 example: 120
 *
 *               tipo:
 *                 type: string
 *                 enum:
 *                   - laboratorio
 *                   - sala
 *                   - auditorio
 *                 example: auditorio
 *
 *               ativo:
 *                 type: boolean
 *                 example: true
 *
 *     responses:
 *       201:
 *         description: Espaço criado com sucesso
 *       401:
 *         description: Não autorizado
 *       400:
 *         description: Dados inválidos
 */
router.post(
  "/",
  authMiddleware,
  controller.criar.bind(controller)
);

/**
 * @swagger
 * /espacos/{id}:
 *   put:
 *     summary: Atualiza um espaço
 *     description: Atualiza os dados de um espaço existente
 *     tags: [Espaços]
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
 *         description: ID do espaço
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *
 *             properties:
 *               nome:
 *                 type: string
 *
 *               descricao:
 *                 type: string
 *
 *               capacidade:
 *                 type: number
 *
 *               ativo:
 *                 type: boolean
 *
 *     responses:
 *       200:
 *         description: Espaço atualizado com sucesso
 *
 *       401:
 *         description: Não autorizado
 *
 *       404:
 *         description: Espaço não encontrado
 */
router.put(
  "/:id",
  authMiddleware,
  controller.atualizar.bind(controller)
);

/**
 * @swagger
 * /espacos/{id}:
 *   delete:
 *     summary: Remove um espaço
 *     description: Remove um espaço do sistema
 *     tags: [Espaços]
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
 *         description: ID do espaço
 *
 *     responses:
 *       200:
 *         description: Espaço removido com sucesso
 *
 *       401:
 *         description: Não autorizado
 *
 *       404:
 *         description: Espaço não encontrado
 */
router.delete(
  "/:id",
  authMiddleware,
  controller.deletar.bind(controller)
);

export default router;