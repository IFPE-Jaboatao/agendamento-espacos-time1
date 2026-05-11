import { Request, Response } from "express";
import { EspacoService } from "../services/EspacoService";

/**
 * Controller de espaços físicos
 */
export class EspacoController {

  private service = new EspacoService();

  /**
   * LISTAR ESPAÇOS
   * GET /espacos
   */
  async listar(req: Request, res: Response) {
    const espacos = await this.service.listarTodos();
    return res.json(espacos);
  }

  /**
   * BUSCAR POR ID
   * GET /espacos/:id
   */
  async buscar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const espaco = await this.service.buscarPorId(id);

      return res.json(espaco);
    } catch (err: any) {
      return res.status(404).json({
        error: err.message
      });
    }
  }

  /**
   * CRIAR ESPAÇO
   * POST /espacos
   */
  async criar(req: Request, res: Response) {
    try {
      const usuario = req.user;

      const espaco = await this.service.criar(req.body, usuario);

      return res.status(201).json(espaco);
    } catch (err: any) {
      return res.status(400).json({
        error: err.message
      });
    }
  }

  /**
   * ATUALIZAR ESPAÇO
   * PUT /espacos/:id
   */
  async atualizar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const usuario = req.user;

      const espaco = await this.service.atualizar(id, req.body, usuario);

      return res.json(espaco);
    } catch (err: any) {
      return res.status(400).json({
        error: err.message
      });
    }
  }

  /**
   * DELETAR ESPAÇO
   * DELETE /espacos/:id
   */
  async deletar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const usuario = req.user;

      await this.service.deletar(id, usuario);

      return res.json({ message: "Espaço removido" });
    } catch (err: any) {
      return res.status(400).json({
        error: err.message
      });
    }
  }
}