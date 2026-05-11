import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

/**
 * Controller de autenticação
 * Responsável por login e registro
 */
export class AuthController {

  private service = new AuthService();

  /**
   * LOGIN
   * POST /auth/login
   */
  async login(req: Request, res: Response) {
    try {
      const { login, senha } = req.body;

      const result = await this.service.login(login, senha);

      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({
        error: err.message
      });
    }
  }

  /**
   * REGISTRO DE USUÁRIO
   * POST /auth/register
   */
  async register(req: Request, res: Response) {
    try {
      const usuario = await this.service.registrar(req.body);

      return res.status(201).json(usuario);
    } catch (err: any) {
      return res.status(400).json({
        error: err.message
      });
    }
  }
}