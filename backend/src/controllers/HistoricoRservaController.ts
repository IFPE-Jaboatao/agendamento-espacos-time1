import { Request, Response } from "express";
import Joi from "joi";
import { HistoricoReservaService } from "../services/HistoricoReservaService";
import { logger } from "../utils/logger";

const service = new HistoricoReservaService();

// Histórico manual 
const historicoSchema = Joi.object({
  reservaId: Joi.number().integer().positive().required(),
  usuarioId: Joi.number().integer().positive().required(),
  status: Joi.string().required(),
  descricao: Joi.string().max(500).optional()
});

function parseId(param: string): number | null {
  const id = Number(param);
  return isNaN(id) || id <= 0 ? null : id;
}

export class HistoricoReservaController {

  async listar(req: Request, res: Response) {
    try {
      const historicos = await service.listarTodos();
      logger.info("Históricos listados", { ip: req.ip, total: historicos.length });
      return res.json(historicos);
    } catch (err: any) {
      logger.error("Erro ao listar históricos", { error: err.message });
      return res.status(500).json({ message: "Erro interno ao listar históricos" });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id as string);
      if (!id) return res.status(400).json({ message: "ID inválido" });

      const historico = await service.buscarPorId(id);
      if (!historico) return res.status(404).json({ message: "Histórico não encontrado" });

      return res.json(historico);
    } catch (err: any) {
      logger.error("Erro ao buscar histórico", { id: req.params.id, error: err.message });
      return res.status(500).json({ message: "Erro interno ao buscar histórico" });
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const { error, value } = historicoSchema.validate(req.body);
      if (error) {
        logger.warn("Dados inválidos ao criar histórico", { details: error.details[0].message, ip: req.ip });
        return res.status(400).json({ message: "Dados inválidos", details: error.details[0].message });
      }

      const historico = await service.criarEntradaAutomatica(value);
      logger.info("Histórico criado manualmente", { historicoId: historico.id, ip: req.ip });
      return res.status(201).json(historico);
    } catch (err: any) {
      logger.error("Erro ao criar histórico", { error: err.message });
      return res.status(500).json({ message: "Erro interno ao criar histórico" });
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id as string);
      if (!id) return res.status(400).json({ message: "ID inválido" });

      const historico = await service.buscarPorId(id);
      if (!historico) return res.status(404).json({ message: "Histórico não encontrado" });

      await service.deletar(id);
      logger.info("Histórico deletado", { historicoId: id, ip: req.ip });
      return res.status(204).send();
    } catch (err: any) {
      logger.error("Erro ao deletar histórico", { id: req.params.id, error: err.message });
      return res.status(500).json({ message: "Erro interno ao deletar histórico" });
    }
  }
}