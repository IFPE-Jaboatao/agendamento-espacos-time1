import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController";

const router = Router();
const controller = new UsuarioController();

router.get("/", controller.listar);
router.get("/:id", controller.buscarPorId);
router.put("/:id", controller.atualizar);
router.delete("/:id", controller.deletar);

export default router;