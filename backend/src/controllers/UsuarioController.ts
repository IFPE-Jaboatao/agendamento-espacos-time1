import { Request, Response } from "express";
import { UsuarioService } from "../services/UsuarioService";

/**
 * Controller de usuários
 * CRUD administrativo
 */
export class UsuarioController {

  private service = new UsuarioService();

  /**
   * LISTAR USUÁRIOS
   * GET /usuarios
   */
  async listar(req: Request, res: Response) {
    const usuarios = await this.service.listarTodos();
    return res.json(usuarios);
  }

  /**
   * BUSCAR POR ID
   * GET /usuarios/:id
   */
  async buscar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const usuario = await this.service.buscarPorId(id);

      return res.json(usuario);
    } catch (err: any) {
      return res.status(404).json({
        error: err.message
      });
    }
  }

  /**
   * CRIAR USUÁRIO (ADMIN)
   * POST /usuarios
   */
  async criar(req: Request, res: Response) {
    try {
      const usuario = await this.service.criar(req.body);

      return res.status(201).json(usuario);
    } catch (err: any) {
      return res.status(400).json({
        error: err.message
      });
    }
  }

  /**
   * ATUALIZAR USUÁRIO
   * PUT /usuarios/:id
   */
  async atualizar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const usuario = await this.service.atualizar(id, req.body);

      return res.json(usuario);
    } catch (err: any) {
      return res.status(400).json({
        error: err.message
      });
    }
  }

  /**
   * DELETAR USUÁRIO
   * DELETE /usuarios/:id
   */
  async deletar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      await this.service.deletar(id);

      return res.json({ message: "Usuário removido" });
    } catch (err: any) {
      return res.status(400).json({
        error: err.message
      });
    }
  }
}