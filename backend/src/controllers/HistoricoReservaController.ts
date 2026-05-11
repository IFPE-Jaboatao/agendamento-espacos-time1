import { Request, Response } from "express";
import Joi from "joi";
import { HistoricoReservaService } from "../services/HistoricoReservaService";
import { logger } from "../utils/logger";

// Instância do service
const service = new HistoricoReservaService();

/**
 * Schema para criação manual de histórico
 */
const historicoSchema = Joi.object({
  reservaId: Joi.number().integer().positive().required(),
  usuarioId: Joi.number().integer().positive().required(),
  status: Joi.string().required(),
  descricao: Joi.string().max(500).optional()
});

/**
 * Converte ID da rota com segurança
 */
function parseId(param: string | string[] | undefined): number | null {
  if (!param) return null;

  const idParam = Array.isArray(param) ? param[0] : param;
  const id = Number(idParam);

  return isNaN(id) || id <= 0 ? null : id;
}

/**
 * CONTROLLER DE HISTÓRICO (AUDITORIA)
 */
export class HistoricoReservaController {

  /**
   * LISTAR HISTÓRICO
   * Regra:
   * - ADMIN vê tudo
   * - USUÁRIO vê apenas seus registros
   */
  async listar(req: Request, res: Response) {
    try {

      const usuario = (req as any).usuario;

      const historicos = await service.listarComPermissao(usuario);

      logger.info("Históricos listados", {
        usuarioId: usuario.id,
        total: historicos.length
      });

      return res.json(historicos);

    } catch (err: any) {

      logger.error("Erro ao listar históricos", {
        erro: err.message
      });

      return res.status(500).json({
        message: "Erro interno ao listar históricos"
      });
    }
  }

  /**
   * BUSCAR HISTÓRICO POR ID
   */
  async buscarPorId(req: Request, res: Response) {
    try {

      const id = parseId(req.params.id);

      if (!id) {
        return res.status(400).json({
          message: "ID inválido"
        });
      }

      const usuario = (req as any).usuario;

      const historico = await service.buscarPorId(id, usuario);

      return res.json(historico);

    } catch (err: any) {

      logger.error("Erro ao buscar histórico", {
        id: req.params.id,
        erro: err.message
      });

      return res.status(500).json({
        message: "Erro interno ao buscar histórico"
      });
    }
  }

  /**
   * CRIAR HISTÓRICO MANUAL (ADMIN)
   */
  async criar(req: Request, res: Response) {
    try {

      const { error, value } = historicoSchema.validate(req.body);

      if (error) {
        logger.warn("Dados inválidos ao criar histórico", {
          erro: error.details[0].message,
          ip: req.ip
        });

        return res.status(400).json({
          message: "Dados inválidos",
          details: error.details[0].message
        });
      }

      const historico = await service.criar(value);

      logger.info("Histórico criado manualmente", {
        historicoId: historico.id,
        ip: req.ip
      });

      return res.status(201).json(historico);

    } catch (err: any) {

      logger.error("Erro ao criar histórico", {
        erro: err.message
      });

      return res.status(500).json({
        message: "Erro interno ao criar histórico"
      });
    }
  }

  /**
   * DELETAR HISTÓRICO
   */
  async deletar(req: Request, res: Response) {
    try {

      const id = parseId(req.params.id);

      if (!id) {
        return res.status(400).json({
          message: "ID inválido"
        });
      }

      const usuario = (req as any).usuario;

      await service.deletar(id, usuario);

      logger.info("Histórico deletado", {
        historicoId: id,
        usuarioId: usuario.id
      });

      return res.status(204).send();

    } catch (err: any) {

      logger.error("Erro ao deletar histórico", {
        id: req.params.id,
        erro: err.message
      });

      return res.status(500).json({
        message: "Erro interno ao deletar histórico"
      });
    }
  }
}