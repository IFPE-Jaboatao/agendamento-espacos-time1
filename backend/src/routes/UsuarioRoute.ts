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
 *   description: Gerenciamento de usuários
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Usuários]
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
 *     tags: [Usuários]
 */
router.get(
  "/:id",
  controller.buscar.bind(controller)
);

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cria usuário manualmente (ADMIN)
 *     tags: [Usuários]
 */
router.post(
  "/",
  controller.criar.bind(controller)
);

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Atualiza usuário
 *     tags: [Usuários]
 */
router.put(
  "/:id",
  controller.atualizar.bind(controller)
);

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Remove usuário
 *     tags: [Usuários]
 */
router.delete(
  "/:id",
  controller.deletar.bind(controller)
);

export default router;