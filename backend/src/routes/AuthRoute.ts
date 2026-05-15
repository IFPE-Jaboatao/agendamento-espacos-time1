import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

const router = Router();
const controller = new AuthController();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Rotas de autenticação
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza login no sistema
 *     description: Autentica o usuário e retorna um token JWT
 *     tags: [Auth]
 *
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
 *                 example: victor
 *
 *               senha:
 *                 type: string
 *                 example: 123456
 *
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *
 *                     nome:
 *                       type: string
 *
 *                     email:
 *                       type: string
 *
 *                     login:
 *                       type: string
 *
 *                     perfil:
 *                       type: string
 *                       example: usuario
 *
 *       400:
 *         description: Login ou senha inválidos
 *
 *       500:
 *         description: Erro interno do servidor
 */
router.post(
  "/login",
  controller.login.bind(controller)
);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     description: Cria um novo usuário no sistema
 *     tags: [Auth]
 *
 *     requestBody:
 *       required: true
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
 *                 example: aluno
 *
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *
 *       400:
 *         description: Dados inválidos
 *
 *       409:
 *         description: Usuário já existe
 *
 *       500:
 *         description: Erro interno do servidor
 */
router.post(
  "/register",
  controller.register.bind(controller)
);

export default router;