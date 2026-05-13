import { Request, Response, NextFunction } from "express";
import { Perfil } from "../entities/Usuario";

/**
 * Middleware:
 * Permite acesso apenas para ADMIN
 */
export function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {

  // usuário não autenticado
  if (!req.user) {
    return res.status(401).json({
      error: "Usuário não autenticado"
    });
  }

  // usuário sem permissão
  if (req.user.perfil !== Perfil.ADMIN) {
    return res.status(403).json({
      error: "Apenas administradores"
    });
  }

  next();
}