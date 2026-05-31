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
  async listarReservas(req: Request, res: Response) {
  try {

    const reservas = await this.service.listarTodos(
      req.user
    );

    return res.json(reservas);

  } catch (err: any) {

    return res.status(400).json({
      error: err.message
    });

  }
}

  /**
   * BUSCAR POR ID
   * GET /reservas/:id
   */
  async buscarReservas(req: Request, res: Response) {
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

      const {
        espacoId,
        ...resto
      } = req.body;

      const dados = {
        ...resto,
        solicitante: req.user,
        espaco: {
          id: Number(espacoId)
        }
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
  async aprovarReserva(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const result = await this.service.aprovar(
        id,
        req.user
      );

      return res.json(result);

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
  async recusarReserva(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const { motivo } = req.body;

      const result = await this.service.recusar(
        id,
        motivo,
        req.user
      );

      return res.json(result);

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
  async cancelarReserva(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const result = await this.service.cancelar(
        id,
        req.user
      );

      return res.json(result);

    } catch (err: any) {
      return res.status(400).json({
        error: err.message
      });
    }
  }

  /**
   * HISTÓRICO (LOG DA RESERVA)
   * GET /historico/:id
   */
  async obterLog(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const log = await this.service.obterLog(id, req.user);

      return res.json(log);
    } catch (err: any) {
      return res.status(404).json({ error: err.message });
    }
  }

  /**
  * HISTÓRICO POR PERÍODO
  * GET /reservas/historico?inicio=...&fim=...
  */
  async historicoPeriodo(req: Request, res: Response) {
    try {
      const { inicio, fim } = req.query;

      const reservas = await this.service.historicoPorPeriodo(
        new Date(inicio as string),
        new Date(fim as string),
        req.user
      );

      return res.json(reservas);

    } catch (err: any) {
      return res.status(400).json({
        error: err.message
      });
    }
  }
}