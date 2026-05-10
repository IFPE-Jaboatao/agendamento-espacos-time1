import { Router } from "express";
import { ReservaController } from "../controllers/ReservaController";

const router = Router();
const controller = new ReservaController();

// ================================
// LISTAR TODAS AS RESERVAS
// GET /reservas
// ================================
router.get(
  "/",
  controller.listar.bind(controller)
);

// ================================
// BUSCAR RESERVA POR ID
// GET /reservas/:id
// ================================
router.get(
  "/:id",
  controller.buscarPorId.bind(controller)
);

// ================================
// CRIAR NOVA RESERVA
// POST /reservas
// ================================
router.post(
  "/",
  controller.criar.bind(controller)
);

// ================================
// ATUALIZAR RESERVA
// PUT /reservas/:id
// ================================
router.put(
  "/:id",
  controller.atualizar.bind(controller)
);

// ================================
// CANCELAR RESERVA
// DELETE /reservas/:id
// ================================
router.delete(
  "/:id",
  controller.cancelar.bind(controller)
);

export default router;