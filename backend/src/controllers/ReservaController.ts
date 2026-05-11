import { Request, Response } from "express";
import Joi from "joi";
import { ReservaService } from "../services/ReservaService";
import { logger } from "../utils/logger";

const service = new ReservaService();

/**
 * Schema de criação de reserva
 * regra importante: solicitante vem do JWT, não do body
 */
const reservaSchema = Joi.object({
  espaco: Joi.object({
    id: Joi.number().integer().positive().required()
  }).required(),

  dataInicio: Joi.date().iso().required(),

  dataFim: Joi.date()
    .iso()
    .greater(Joi.ref("dataInicio"))
    .required(),

  descricao: Joi.string().max(500).optional()
});

/**
 * Schema de atualização (uso futuro)
 */
const reservaUpdateSchema = reservaSchema.fork(
  ["espaco", "dataInicio", "dataFim"],
  (field) => field.optional()
);

/**
 * Converte e valida ID da rota
 */
function parseId(param: string | string[] | undefined): number | null {
  if (!param) return null;

  const idParam = Array.isArray(param) ? param[0] : param;
  const id = Number(idParam);

  return isNaN(id) || id <= 0 ? null : id;
}

/**
 * CONTROLLER DE RESERVAS
 */
export class ReservaController {

  /**
   * LISTAR RESERVAS
   * Regra:
   * - ADMIN → todas reservas
   * - USUÁRIO → apenas próprias
   */
  async listar(req: Request, res: Response) {
    try {

      const usuario = (req as any).usuario;

      // proteção de autenticação
      if (!usuario) {
        return res.status(401).json({
          message: "Usuário não autenticado"
        });
      }

      const reservas = await service.listarTodos(usuario);

      logger.info("Reservas listadas", {
        usuarioId: usuario.id,
        total: reservas.length
      });

      return res.json(reservas);

    } catch (err: any) {

      logger.error("Erro ao listar reservas", {
        erro: err.message
      });

      return res.status(500).json({
        message: "Erro interno ao listar reservas"
      });
    }
  }

  /**
   * BUSCAR RESERVA POR ID
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

      if (!usuario) {
        return res.status(401).json({
          message: "Usuário não autenticado"
        });
      }

      const reserva = await service.buscarPorId(id, usuario);

      return res.json(reserva);

    } catch (err: any) {

      logger.error("Erro ao buscar reserva", {
        id: req.params.id,
        erro: err.message
      });

      return res.status(500).json({
        message: "Erro interno ao buscar reserva"
      });
    }
  }

  /**
   * CRIAR RESERVA
   */
  async criar(req: Request, res: Response) {
    try {

      const { error, value } = reservaSchema.validate(req.body);

      if (error) {
        logger.warn("Dados inválidos ao criar reserva", {
          erro: error.details[0].message,
          ip: req.ip
        });

        return res.status(400).json({
          message: "Dados inválidos",
          details: error.details[0].message
        });
      }

      const usuario = (req as any).usuario;

      if (!usuario) {
        return res.status(401).json({
          message: "Usuário não autenticado"
        });
      }

      // solicitante sempre vem do JWT (SEGURANÇA)
      const reserva = await service.criar({
        ...value,
        solicitante: usuario
      });

      logger.info("Reserva criada", {
        reservaId: reserva.id,
        usuarioId: usuario.id
      });

      return res.status(201).json(reserva);

    } catch (err: any) {

      logger.error("Erro ao criar reserva", {
        erro: err.message
      });

      return res.status(500).json({
        message: "Erro interno ao criar reserva"
      });
    }
  }

  /**
   * CANCELAR RESERVA
   */
  async cancelar(req: Request, res: Response) {
    try {

      const id = parseId(req.params.id);

      if (!id) {
        return res.status(400).json({
          message: "ID inválido"
        });
      }

      const usuario = (req as any).usuario;

      if (!usuario) {
        return res.status(401).json({
          message: "Usuário não autenticado"
        });
      }

      await service.cancelar(id, usuario);

      logger.info("Reserva cancelada", {
        reservaId: id,
        usuarioId: usuario.id
      });

      return res.status(204).send();

    } catch (err: any) {

      logger.error("Erro ao cancelar reserva", {
        id: req.params.id,
        erro: err.message
      });

      return res.status(500).json({
        message: "Erro interno ao cancelar reserva"
      });
    }
  }
}