import { Router } from "express";

import AuthRoute from "./AuthRoute";
import UsuarioRoute from "./UsuarioRoute";
import EspacoRoute from "./EspacoRoute";
import ReservaRoute from "./ReservaRoute";
import HistoricoReservaRoute from "./HistoricoReservaRoute";

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

router.use("/historico", HistoricoReservaRoute);

export default router;