import { Router } from "express";

import { HistoricoReservaController } from "../controllers/HistoricoReservaController";

const router = Router();
const controller = new HistoricoReservaController();

// ================================
// LISTAR HISTÓRICO DE RESERVAS
// GET /historicos
// ================================
router.get(
  "/",
  controller.listar.bind(controller)
);

// ================================
// BUSCAR HISTÓRICO POR ID
// GET /historicos/:id
// ================================
router.get(
  "/:id",
  controller.buscarPorId.bind(controller)
);

// ================================
// CRIAR ENTRADA MANUAL NO HISTÓRICO
// POST /historicos
// ================================
router.post(
  "/",
  controller.criar.bind(controller)
);

// ================================
// DELETAR HISTÓRICO
// DELETE /historicos/:id
// ================================
router.delete(
  "/:id",
  controller.deletar.bind(controller)
);

export default router;