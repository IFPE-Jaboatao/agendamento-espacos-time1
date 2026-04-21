import { Router } from "express";
import { EspacoController } from "../controllers/EspacoController";
import { exigirPerfil } from "../middlewares/perfilMiddleware";
import { Perfil } from "../entities/Usuario";

const router = Router();
const controller = new EspacoController();

router.get("/", controller.listar);
router.get("/:id", controller.buscarPorId);
router.post("/", exigirPerfil(Perfil.ADMIN), controller.criar);         // só admin
router.put("/:id", exigirPerfil(Perfil.ADMIN), controller.atualizar);   // só admin
router.delete("/:id", exigirPerfil(Perfil.ADMIN), controller.deletar);  // só admin

export default router;