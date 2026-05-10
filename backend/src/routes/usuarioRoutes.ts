import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController";

const router = Router();
const controller = new UsuarioController();

// ================================
// LISTAR TODOS OS USUÁRIOS
// GET /usuarios
// ================================
router.get(
  "/",
  controller.listar.bind(controller)
);

// ================================
// BUSCAR USUÁRIO POR ID
// GET /usuarios/:id
// ================================
router.get(
  "/:id",
  controller.buscarPorId.bind(controller)
);

// ================================
// ATUALIZAR USUÁRIO
// PUT /usuarios/:id
// ================================
router.put(
  "/:id",
  controller.atualizar.bind(controller)
);

// ================================
// DELETAR USUÁRIO
// DELETE /usuarios/:id
// ================================
router.delete(
  "/:id",
  controller.deletar.bind(controller)
);

export default router;