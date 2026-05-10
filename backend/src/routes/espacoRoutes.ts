import { Router } from "express";

import { EspacoController } from "../controllers/EspacoController";

import { exigirPerfil } from "../middlewares/perfilMiddleware";
import { Perfil } from "../entities/Usuario";

const router = Router();
const controller = new EspacoController();

// ================================
// LISTAR TODOS OS ESPAÇOS
// GET /espacos
// ================================
router.get(
  "/",
  controller.listar.bind(controller)
);

// ================================
// BUSCAR ESPAÇO POR ID
// GET /espacos/:id
// ================================
router.get(
  "/:id",
  controller.buscarPorId.bind(controller)
);

// ================================
// CRIAR ESPAÇO
// Apenas ADMIN
// POST /espacos
// ================================
router.post(
  "/",
  exigirPerfil(Perfil.ADMIN),
  controller.criar.bind(controller)
);

// ================================
// ATUALIZAR ESPAÇO
// Apenas ADMIN
// PUT /espacos/:id
// ================================
router.put(
  "/:id",
  exigirPerfil(Perfil.ADMIN),
  controller.atualizar.bind(controller)
);

// ================================
// DELETAR ESPAÇO
// Apenas ADMIN
// DELETE /espacos/:id
// ================================
router.delete(
  "/:id",
  exigirPerfil(Perfil.ADMIN),
  controller.deletar.bind(controller)
);

export default router;