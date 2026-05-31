import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController";

import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";

const router = Router();
const controller = new UsuarioController();

/**
 * TODAS AS ROTAS DE USUÁRIOS
 * EXIGEM LOGIN + ADMIN
 */
router.use(authMiddleware);
router.use(adminMiddleware);

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Gerenciamento de usuários do sistema
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Lista todos os usuários
 *     description: Retorna todos os usuários cadastrados no sistema
 *     tags: [Usuários]
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
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
 *                   nome:
 *                     type: string
 *                     example: Victor Gabriel
 *
 *                   email:
 *                     type: string
 *                     example: victor@gmail.com
 *
 *                   login:
 *                     type: string
 *                     example: victor
 *
 *                   perfil:
 *                     type: string
 *                     example: usuario
 *
 *                   tipoUsuario:
 *                     type: string
 *                     example: aluno
 *
 *       401:
 *         description: Não autorizado
 *
 *       403:
 *         description: Acesso negado
 */
router.get(
  "/",
  controller.listar.bind(controller)
);

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Busca usuário por ID
 *     description: Retorna os dados de um usuário específico
 *     tags: [Usuários]
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
 *         description: ID do usuário
 *
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *
 *       401:
 *         description: Não autorizado
 *
 *       403:
 *         description: Acesso negado
 *
 *       404:
 *         description: Usuário não encontrado
 */
router.get(
  "/:id",
  controller.buscar.bind(controller)
);

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cria um novo usuário
 *     description: Cria manualmente um usuário no sistema
 *     tags: [Usuários]
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
 *               - email
 *               - login
 *               - senha
 *
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Victor Gabriel
 *
 *               email:
 *                 type: string
 *                 example: victor@gmail.com
 *
 *               login:
 *                 type: string
 *                 example: victor
 *
 *               senha:
 *                 type: string
 *                 example: 123456
 *
 *               perfil:
 *                 type: string
 *                 example: usuario
 *
 *               tipoUsuario:
 *                 type: string
 *                 enum:
 *                  - aluno
 *                  - professor
 *                  - coordenador
 *                 example: professor
 *
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *
 *       400:
 *         description: Dados inválidos
 *
 *       401:
 *         description: Não autorizado
 *
 *       403:
 *         description: Acesso negado
 */
router.post(
  "/",
  controller.criar.bind(controller)
);

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Atualiza um usuário
 *     description: Atualiza os dados de um usuário existente
 *     tags: [Usuários]
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
 *         description: ID do usuário
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
 *               email:
 *                 type: string
 *
 *               login:
 *                 type: string
 *
 *               senha:
 *                 type: string
 *
 *               perfil:
 *                 type: string
 *
 *               tipoUsuario:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *
 *       401:
 *         description: Não autorizado
 *
 *       403:
 *         description: Acesso negado
 *
 *       404:
 *         description: Usuário não encontrado
 */
router.put(
  "/:id",
  controller.atualizar.bind(controller)
);

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Remove um usuário
 *     description: Remove um usuário do sistema
 *     tags: [Usuários]
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
 *         description: ID do usuário
 *
 *     responses:
 *       200:
 *         description: Usuário removido com sucesso
 *
 *       401:
 *         description: Não autorizado
 *
 *       403:
 *         description: Acesso negado
 *
 *       404:
 *         description: Usuário não encontrado
 */
router.delete(
  "/:id",
  controller.deletar.bind(controller)
);

export default router;