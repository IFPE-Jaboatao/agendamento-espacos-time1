import { Request, Response } from "express";
import { HistoricoReservaService } from "../services/HistoricoReservaService";

/**
 * Controller de auditoria (histórico)
 */
export class HistoricoReservaController {

  private service = new HistoricoReservaService();

  /**
   * LISTAR HISTÓRICOS
   * GET /historico
   */
  async listar(req: Request, res: Response) {
    const historico = await this.service.listarComPermissao(req.user);
    return res.json(historico);
  }

  /**
   * BUSCAR POR ID
   * GET /historico/:id
   */
  async buscar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const historico = await this.service.buscarPorId(id, req.user);

      return res.json(historico);
    } catch (err: any) {
      return res.status(404).json({
        error: err.message
      });
    }
  }

  /**
   * DELETAR HISTÓRICO (ADMIN)
   * DELETE /historico/:id
   */
  async deletar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      await this.service.deletar(id, req.user);

      return res.json({ message: "Histórico removido" });
    } catch (err: any) {
      return res.status(400).json({
        error: err.message
      });
    }
  }
}