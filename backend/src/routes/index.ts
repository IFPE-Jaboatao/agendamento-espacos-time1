import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import usuarioRoutes from "./usuarioRoutes";
import reservaRoutes from "./reservaRoutes";
import espacoRoutes from "./espacoRoutes";
import { autenticar } from "../middlewares/authMiddleware";
import { exigirPerfil } from "../middlewares/perfilMiddleware";
import { Perfil } from "../entities/Usuario";

const router = Router();
const authController = new AuthController();

// Rotas públicas
router.post("/auth/login", authController.login);

// Rotas protegidas
router.post("/auth/registrar", autenticar, exigirPerfil(Perfil.ADMIN), authController.registrar);
router.use("/reservas", autenticar, reservaRoutes);
router.use("/usuarios", autenticar, exigirPerfil(Perfil.ADMIN), usuarioRoutes);
router.use("/espacos", autenticar, espacoRoutes);

export default router;