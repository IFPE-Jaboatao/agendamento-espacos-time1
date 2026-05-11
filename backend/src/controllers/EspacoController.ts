import { Request, Response } from "express";
import Joi from "joi";
import { EspacoService } from "../services/EspacoService";
import { logger } from "../utils/logger";
const service = new EspacoService();

/**
 * Schema de validação para criação de espaço
 */
const espacoSchema = Joi.object({
  nome: Joi.string().min(2).max(100).required(),
  descricao: Joi.string().max(500).optional(),
  capacidade: Joi.number().integer().min(1).optional(),
  status: Joi.string().valid("ativo", "inativo").optional()
});

/**
 * Schema para atualização (nome deixa de ser obrigatório)
 */
const espacoUpdateSchema = espacoSchema.fork(
  ["nome"],
  (field) => field.optional()
);

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
 * CONTROLLER DE ESPAÇOS
 */
export class EspacoController {

  /**
   * LISTAR TODOS OS ESPAÇOS ATIVOS
   */
  async listar(req: Request, res: Response) {
    try {

      const espacos = await service.listarTodos();

      logger.info("Espaços listados", {
        ip: req.ip,
        total: espacos.length
      });

      return res.json(espacos);

    } catch (err: any) {

      logger.error("Erro ao listar espaços", {
        erro: err.message
      });

      return res.status(500).json({
        message: "Erro interno ao listar espaços"
      });
    }
  }

  /**
   * BUSCAR ESPAÇO POR ID
   */
  async buscarPorId(req: Request, res: Response) {
    try {

      const id = parseId(req.params.id);

      if (!id) {
        return res.status(400).json({
          message: "ID inválido"
        });
      }

      const espaco = await service.buscarPorId(id);

      return res.json(espaco);

    } catch (err: any) {

      logger.error("Erro ao buscar espaço", {
        id: req.params.id,
        erro: err.message
      });

      return res.status(500).json({
        message: "Erro interno ao buscar espaço"
      });
    }
  }

  /**
   * CRIAR ESPAÇO
   * Regra: precisa do usuário logado (ADMIN)
   */
  async criar(req: Request, res: Response) {
    try {

      const { error, value } = espacoSchema.validate(req.body);

      if (error) {
        logger.warn("Dados inválidos ao criar espaço", {
          erro: error.details[0].message,
          ip: req.ip
        });

        return res.status(400).json({
          message: "Dados inválidos",
          details: error.details[0].message
        });
      }

      // usuário vindo do middleware JWT
      const usuario = (req as any).usuario;

      const espaco = await service.criar(value, usuario);

      logger.info("Espaço criado", {
        espacoId: espaco.id,
        usuarioId: usuario.id
      });

      return res.status(201).json(espaco);

    } catch (err: any) {

      logger.error("Erro ao criar espaço", {
        erro: err.message
      });

      return res.status(500).json({
        message: "Erro interno ao criar espaço"
      });
    }
  }

  /**
   * ATUALIZAR ESPAÇO
   */
  async atualizar(req: Request, res: Response) {
    try {

      const id = parseId(req.params.id);

      if (!id) {
        return res.status(400).json({
          message: "ID inválido"
        });
      }

      const { error, value } = espacoUpdateSchema.validate(req.body);

      if (error) {
        return res.status(400).json({
          message: "Dados inválidos",
          details: error.details[0].message
        });
      }

      const usuario = (req as any).usuario;

      const espaco = await service.atualizar(id, value, usuario);

      logger.info("Espaço atualizado", {
        espacoId: id,
        usuarioId: usuario.id
      });

      return res.json(espaco);

    } catch (err: any) {

      logger.error("Erro ao atualizar espaço", {
        id: req.params.id,
        erro: err.message
      });

      return res.status(500).json({
        message: "Erro interno ao atualizar espaço"
      });
    }
  }

  /**
   * DELETAR ESPAÇO
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

      logger.info("Espaço deletado", {
        espacoId: id,
        usuarioId: usuario.id
      });

      return res.status(204).send();

    } catch (err: any) {

      logger.error("Erro ao deletar espaço", {
        id: req.params.id,
        erro: err.message
      });

      return res.status(500).json({
        message: "Erro interno ao deletar espaço"
      });
    }
  }
}