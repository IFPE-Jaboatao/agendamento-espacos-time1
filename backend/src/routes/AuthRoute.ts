import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

const router = Router();
const controller = new AuthController();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticação
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza login
 *     tags: [Auth]
 */
router.post(
  "/login",
  controller.login.bind(controller)
);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra novo usuário
 *     tags: [Auth]
 */
router.post(
  "/register",
  controller.register.bind(controller)
);

export default router;