import { Request, Response } from "express";
import Joi from "joi";
import { EspacoService } from "../services/EspacoService";

const logger = {
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
};

const service = new EspacoService();

// Schema de criação/atualização de espaço
const espacoSchema = Joi.object({
  nome: Joi.string().min(2).max(100).required(),
  descricao: Joi.string().max(500).optional(),
  capacidade: Joi.number().integer().min(1).optional(),
  status: Joi.string().valid("ativo", "inativo").optional()
});

const espacoUpdateSchema = espacoSchema.fork(
  ["nome"],
  (field) => field.optional()
);

// Valida se o ID da rota é um número válido
function parseId(param: string | string[] | undefined): number | null {
  if (!param) return null;
  const idParam = Array.isArray(param) ? param[0] : param;
  const id = Number(idParam);
  return isNaN(id) || id <= 0 ? null : id;
}

export class EspacoController {

  async listar(req: Request, res: Response) {
    try {
      const espacos = await service.listarTodos();
      logger.info("Espaços listados", { ip: req.ip, total: espacos.length });
      return res.json(espacos);
    } catch (err: any) {
      logger.error("Erro ao listar espaços", { error: err.message });
      return res.status(500).json({ message: "Erro interno ao listar espaços" });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id as string);
      if (!id) return res.status(400).json({ message: "ID inválido" });

      const espaco = await service.buscarPorId(id);
      if (!espaco) return res.status(404).json({ message: "Espaço não encontrado" });

      return res.json(espaco);
    } catch (err: any) {
      logger.error("Erro ao buscar espaço", { id: req.params.id, error: err.message });
      return res.status(500).json({ message: "Erro interno ao buscar espaço" });
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const { error, value } = espacoSchema.validate(req.body);
      if (error) {
        logger.warn("Dados inválidos ao criar espaço", { details: error.details[0].message, ip: req.ip });
        return res.status(400).json({ message: "Dados inválidos", details: error.details[0].message });
      }

      const espaco = await service.criar(value);
      logger.info("Espaço criado", { espacoId: espaco.id, ip: req.ip });
      return res.status(201).json(espaco);
    } catch (err: any) {
      logger.error("Erro ao criar espaço", { error: err.message });
      return res.status(500).json({ message: "Erro interno ao criar espaço" });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (!id) return res.status(400).json({ message: "ID inválido" });

      const { error, value } = espacoUpdateSchema.validate(req.body);
      if (error) {
        logger.warn("Dados inválidos ao atualizar espaço", { id, details: error.details[0].message });
        return res.status(400).json({ message: "Dados inválidos", details: error.details[0].message });
      }

      const espaco = await service.atualizar(id, value);
      if (!espaco) return res.status(404).json({ message: "Espaço não encontrado" });

      logger.info("Espaço atualizado", { espacoId: id, ip: req.ip });
      return res.json(espaco);
    } catch (err: any) {
      logger.error("Erro ao atualizar espaço", { id: req.params.id, error: err.message });
      return res.status(500).json({ message: "Erro interno ao atualizar espaço" });
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id);
      if (!id) return res.status(400).json({ message: "ID inválido" });

      const espaco = await service.buscarPorId(id);
      if (!espaco) return res.status(404).json({ message: "Espaço não encontrado" });

      await service.deletar(id);
      logger.info("Espaço deletado", { espacoId: id, ip: req.ip });
      return res.status(204).send();
    } catch (err: any) {
      logger.error("Erro ao deletar espaço", { id: req.params.id, error: err.message });
      return res.status(500).json({ message: "Erro interno ao deletar espaço" });
    }
  }
}