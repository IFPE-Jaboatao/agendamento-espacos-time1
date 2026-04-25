import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger";

export interface AuthRequest extends Request {
  usuario?: { id: number; perfil: string };
}

export function autenticar(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token não fornecido ou formato inválido" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; perfil: string };
    req.usuario = payload;
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      logger.warn('Token expirado', { ip: req.ip, userAgent: req.get('User-Agent') });
      return res.status(401).json({ message: "Token expirado" });
    } else if (err.name === "JsonWebTokenError") {
      logger.warn('Token inválido', { ip: req.ip, userAgent: req.get('User-Agent') });
      return res.status(401).json({ message: "Token inválido" });
    } else {
      logger.error('Erro na verificação do token', { ip: req.ip, error: err.message });
      return res.status(401).json({ message: "Erro na autenticação" });
    }
  }
}