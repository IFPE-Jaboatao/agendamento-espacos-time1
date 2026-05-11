import { Request, Response } from "express";
import { ReservaService } from "../services/ReservaService";

/**
 * Controller de reservas
 */
export class ReservaController {

  private service = new ReservaService();

  /**
   * LISTAR RESERVAS
   * GET /reservas
   */
  async listar(req: Request, res: Response) {
    const reservas = await this.service.listarTodos(req.user);
    return res.json(reservas);
  }

  /**
   * BUSCAR POR ID
   * GET /reservas/:id
   */
  async buscar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const reserva = await this.service.buscarPorId(id, req.user);

      return res.json(reserva);
    } catch (err: any) {
      return res.status(404).json({
        error: err.message
      });
    }
  }

  /**
   * CRIAR RESERVA
   * POST /reservas
   */
  async criar(req: Request, res: Response) {
    try {
      const dados = {
        ...req.body,
        solicitante: req.user
      };

      const reserva = await this.service.criar(dados);

      return res.status(201).json(reserva);
    } catch (err: any) {
      return res.status(400).json({
        error: err.message
      });
    }
  }

  /**
   * APROVAR RESERVA
   * PATCH /reservas/:id/aprovar
   */
  async aprovar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      await this.service.aprovar(id, req.user);

      return res.json({ message: "Reserva aprovada" });
    } catch (err: any) {
      return res.status(400).json({
        error: err.message
      });
    }
  }

  /**
   * RECUSAR RESERVA
   * PATCH /reservas/:id/recusar
   */
  async recusar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const { motivo } = req.body;

      await this.service.recusar(id, motivo, req.user);

      return res.json({ message: "Reserva recusada" });
    } catch (err: any) {
      return res.status(400).json({
        error: err.message
      });
    }
  }

  /**
   * CANCELAR RESERVA
   * PATCH /reservas/:id/cancelar
   */
  async cancelar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      await this.service.cancelar(id, req.user);

      return res.json({ message: "Reserva cancelada" });
    } catch (err: any) {
      return res.status(400).json({
        error: err.message
      });
    }
  }
}