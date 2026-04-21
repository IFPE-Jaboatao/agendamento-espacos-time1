import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";
import { Perfil } from "../entities/Usuario";

export function exigirPerfil(...perfis: Perfil[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.usuario || !perfis.includes(req.usuario.perfil as Perfil)) {
      return res.status(403).json({ message: "Acesso negado" });
    }
    next();
  };
}