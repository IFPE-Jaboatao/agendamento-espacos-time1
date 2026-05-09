import { Request, Response } from "express";
import Joi from "joi";
import { ReservaService } from "../services/ReservaService";
import { logger } from "../utils/logger";

const service = new ReservaService();

const reservaSchema = Joi.object({
  espacoId: Joi.number().integer().positive().required(),
  solicitanteId: Joi.number().integer().positive().required(),
  dataInicio: Joi.date().iso().required(),
  dataFim: Joi.date().iso().greater(Joi.ref("dataInicio")).required(),
  descricao: Joi.string().max(500).optional()
});

const reservaUpdateSchema = reservaSchema.fork(
  ["espacoId", "solicitanteId", "dataInicio", "dataFim"],
  (field) => field.optional()
);

function parseId(param: string): number | null {
  const id = Number(param);
  return isNaN(id) || id <= 0 ? null : id;
}

export class ReservaController {

  async listar(req: Request, res: Response) {
    try {
      const reservas = await service.listarTodas();
      logger.info("Reservas listadas", { ip: req.ip, total: reservas.length });
      return res.json(reservas);
    } catch (err: any) {
      logger.error("Erro ao listar reservas", { error: err.message });
      return res.status(500).json({ message: "Erro interno ao listar reservas" });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id as string);
      if (!id) return res.status(400).json({ message: "ID inválido" });

      const reserva = await service.buscarPorId(id);
      if (!reserva) return res.status(404).json({ message: "Reserva não encontrada" });

      return res.json(reserva);
    } catch (err: any) {
      logger.error("Erro ao buscar reserva", { id: req.params.id, error: err.message });
      return res.status(500).json({ message: "Erro interno ao buscar reserva" });
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const { error, value } = reservaSchema.validate(req.body);
      if (error) {
        logger.warn("Dados inválidos ao criar reserva", { details: error.details[0].message, ip: req.ip });
        return res.status(400).json({ message: "Dados inválidos", details: error.details[0].message });
      }

      const reserva = await service.criar(value);
      logger.info("Reserva criada", { reservaId: reserva.id, ip: req.ip });
      return res.status(201).json(reserva);
    } catch (err: any) {
      logger.error("Erro ao criar reserva", { error: err.message });
      return res.status(500).json({ message: "Erro interno ao criar reserva" });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id as string);
      if (!id) return res.status(400).json({ message: "ID inválido" });

      const { error, value } = reservaUpdateSchema.validate(req.body);
      if (error) {
        logger.warn("Dados inválidos ao atualizar reserva", { id, details: error.details[0].message });
        return res.status(400).json({ message: "Dados inválidos", details: error.details[0].message });
      }

      const reserva = await service.atualizar(id, value);
      if (!reserva) return res.status(404).json({ message: "Reserva não encontrada" });

      logger.info("Reserva atualizada", { reservaId: id, ip: req.ip });
      return res.json(reserva);
    } catch (err: any) {
      logger.error("Erro ao atualizar reserva", { id: req.params.id, error: err.message });
      return res.status(500).json({ message: "Erro interno ao atualizar reserva" });
    }
  }

  async cancelar(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id as string);
      if (!id) return res.status(400).json({ message: "ID inválido" });

      // Verifica existência antes de cancelar
      const reserva = await service.buscarPorId(id);
      if (!reserva) return res.status(404).json({ message: "Reserva não encontrada" });

      await service.cancelar(id);
      logger.info("Reserva cancelada", { reservaId: id, ip: req.ip });
      return res.status(204).send();
    } catch (err: any) {
      logger.error("Erro ao cancelar reserva", { id: req.params.id, error: err.message });
      return res.status(500).json({ message: "Erro interno ao cancelar reserva" });
    }
  }
}