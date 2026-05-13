/// <reference path="../@types/express/index.d.ts" />

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { AppDataSource } from "../data-source";
import { Usuario, Perfil } from "../entities/Usuario";

const repo = AppDataSource.getRepository(Usuario);

/**
 * AQUI
 */
interface TokenPayload {
  id: number;
  perfil: Perfil;
}

/**
 * Middleware de autenticação JWT
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {

  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Token não informado"
      });
    }

    const [, token] = authHeader.split(" ");

    if (!token) {
      return res.status(401).json({
        error: "Token inválido"
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET não configurado");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as TokenPayload;

    const usuario = await repo.findOneBy({
      id: decoded.id
    });

    if (!usuario) {
      return res.status(401).json({
        error: "Usuário não encontrado"
      });
    }

    req.user = usuario;

    next();

  } catch (err) {

    return res.status(401).json({
      error: "Token inválido ou expirado"
    });

  }
}