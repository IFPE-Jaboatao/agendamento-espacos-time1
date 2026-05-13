import { Router } from "express";
import { EspacoController } from "../controllers/EspacoController";

import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const controller = new EspacoController();

/**
 * @swagger
 * tags:
 *   name: Espaços
 *   description: Gerenciamento de espaços
 */

/**
 * ROTAS PÚBLICAS
 */

/**
 * @swagger
 * /espacos:
 *   get:
 *     summary: Lista espaços ativos
 *     tags: [Espaços]
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
 *     tags: [Espaços]
 */
router.get(
  "/:id",
  controller.buscar.bind(controller)
);

/**
 * ROTAS PRIVADAS
 */

/**
 * @swagger
 * /espacos:
 *   post:
 *     summary: Cria espaço (ADMIN)
 *     tags: [Espaços]
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
 *     summary: Atualiza espaço (ADMIN)
 *     tags: [Espaços]
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
 *     summary: Remove espaço (ADMIN)
 *     tags: [Espaços]
 */
router.delete(
  "/:id",
  authMiddleware,
  controller.deletar.bind(controller)
);

export default router;