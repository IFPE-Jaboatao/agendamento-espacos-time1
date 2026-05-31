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
      const reservas = await this.service.listarTodos(req.user);
      return res.json(reservas);

    } catch (err: any) {
      return res.status(400).json({
        error: err.message || "Erro ao listar reservas"
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

      if (!id || isNaN(id)) {
        return res.status(400).json({
          error: "ID inválido"
        });
      }

      const reserva = await this.service.buscarPorId(id, req.user);

      return res.json(reserva);

    } catch (err: any) {
      return res.status(404).json({
        error: err.message || "Reserva não encontrada"
      });
    }
  }

  /**
   * CRIAR RESERVA
   * POST /reservas
   */
  async criar(req: Request, res: Response) {
    try {
      const { espacoId, ...resto } = req.body;

      if (!espacoId) {
        return res.status(400).json({
          error: "espacoId é obrigatório"
        });
      }

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
        error: err.message || "Erro ao criar reserva"
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

      if (!id || isNaN(id)) {
        return res.status(400).json({
          error: "ID inválido"
        });
      }

      const result = await this.service.aprovar(id, req.user);

      return res.json(result);

    } catch (err: any) {
      return res.status(400).json({
        error: err.message || "Erro ao aprovar reserva"
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

      if (!id || isNaN(id)) {
        return res.status(400).json({
          error: "ID inválido"
        });
      }

      if (!motivo || motivo.trim() === "") {
        return res.status(400).json({
          error: "Motivo obrigatório"
        });
      }

      const result = await this.service.recusar(
        id,
        motivo,
        req.user
      );

      return res.json(result);

    } catch (err: any) {
      return res.status(400).json({
        error: err.message || "Erro ao recusar reserva"
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

      if (!id || isNaN(id)) {
        return res.status(400).json({
          error: "ID inválido"
        });
      }

      const result = await this.service.cancelar(id, req.user);

      return res.json(result);

    } catch (err: any) {
      return res.status(400).json({
        error: err.message || "Erro ao cancelar reserva"
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

      if (!id || isNaN(id)) {
        return res.status(400).json({
          error: "ID inválido"
        });
      }

      const log = await this.service.obterLog(id, req.user);

      return res.json(log);

    } catch (err: any) {
      return res.status(404).json({
        error: err.message || "Histórico não encontrado"
      });
    }
  }

  /**
   * HISTÓRICO POR PERÍODO
   * GET /reservas/historico?inicio=...&fim=...
   */
  async historicoPeriodo(req: Request, res: Response) {
    try {
      const { inicio, fim } = req.query;

      if (!inicio || !fim) {
        return res.status(400).json({
          error: "Parâmetros inicio e fim são obrigatórios"
        });
      }

      const inicioDate = new Date(inicio as string);
      const fimDate = new Date(fim as string);

      if (isNaN(inicioDate.getTime()) || isNaN(fimDate.getTime())) {
        return res.status(400).json({
          error: "Datas inválidas"
        });
      }

      const reservas = await this.service.historicoPorPeriodo(
        inicioDate,
        fimDate,
        req.user
      );

      return res.json(reservas);

    } catch (err: any) {
      return res.status(400).json({
        error: err.message || "Erro ao buscar histórico"
      });
    }
  }
}