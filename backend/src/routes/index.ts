import { Router } from "express";

import AuthRoute from "./AuthRoute";
import UsuarioRoute from "./UsuarioRoute";
import EspacoRoute from "./EspacoRoute";
import ReservaRoute from "./ReservaRoute";

const router = Router();

/**
 * ROTAS PÚBLICAS
 */
router.use("/auth", AuthRoute);

/**
 * ROTAS DO SISTEMA
 */
router.use("/usuarios", UsuarioRoute);

router.use("/espacos", EspacoRoute);

router.use("/reservas", ReservaRoute);


export default router;