import { Router } from "express";
import { ReservaController } from "../controllers/ReservaController";

const router = Router();
const controller = new ReservaController();

router.get("/", controller.listar);
router.get("/:id", controller.buscarPorId);
router.post("/", controller.criar);
router.put("/:id", controller.atualizar);
router.delete("/:id", controller.cancelar);

export default router;