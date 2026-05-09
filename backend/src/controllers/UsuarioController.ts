import { Request, Response } from "express";
import Joi from "joi";
import { UsuarioService } from "../services/UsuarioService";
import { logger } from "../utils/logger";

const service = new UsuarioService();

const usuarioCreateSchema = Joi.object({
  nome: Joi.string().min(2).max(100).required(),
  login: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  senha: Joi.string().min(8).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)")).required(),
  perfil: Joi.string().valid("admin", "usuario").optional().default("usuario")
});

const usuarioUpdateSchema = usuarioCreateSchema.fork(
  ["nome", "login", "email", "senha"],
  (field) => field.optional()
);

function parseId(param: string): number | null {
  const id = Number(param);
  return isNaN(id) || id <= 0 ? null : id;
}

export class UsuarioController {

  async criar(req: Request, res: Response) {
    try {
      const { error, value } = usuarioCreateSchema.validate(req.body);
      if (error) {
        logger.warn("Dados inválidos ao criar usuário", { details: error.details[0].message, ip: req.ip });
        return res.status(400).json({ message: "Dados inválidos", details: error.details[0].message });
      }

      const usuario = await service.criar(value);
      logger.info("Usuário criado", { usuarioId: usuario.id, ip: req.ip });
      // Nunca retorna a senha
      return res.status(201).json({ id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil });
    } catch (err: any) {
      logger.error("Erro ao criar usuário", { error: err.message });
      return res.status(500).json({ message: "Erro interno ao criar usuário" });
    }
  }

  async listar(req: Request, res: Response) {
    try {
      const usuarios = await service.listarTodos();
      logger.info("Usuários listados", { ip: req.ip, total: usuarios.length });
      return res.json(usuarios);
    } catch (err: any) {
      logger.error("Erro ao listar usuários", { error: err.message });
      return res.status(500).json({ message: "Erro interno ao listar usuários" });
    }
  }

  async buscarPorId(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id as string);
      if (!id) return res.status(400).json({ message: "ID inválido" });

      const usuario = await service.buscarPorId(id);
      if (!usuario) return res.status(404).json({ message: "Usuário não encontrado" });

      return res.json(usuario);
    } catch (err: any) {
      logger.error("Erro ao buscar usuário", { id: req.params.id, error: err.message });
      return res.status(500).json({ message: "Erro interno ao buscar usuário" });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id as string);
      if (!id) return res.status(400).json({ message: "ID inválido" });

      const { error, value } = usuarioUpdateSchema.validate(req.body);
      if (error) {
        logger.warn("Dados inválidos ao atualizar usuário", { id, details: error.details[0].message });
        return res.status(400).json({ message: "Dados inválidos", details: error.details[0].message });
      }

      const usuario = await service.atualizar(id, value);
      if (!usuario) return res.status(404).json({ message: "Usuário não encontrado" });

      logger.info("Usuário atualizado", { usuarioId: id, ip: req.ip });
      return res.json(usuario);
    } catch (err: any) {
      logger.error("Erro ao atualizar usuário", { id: req.params.id, error: err.message });
      return res.status(500).json({ message: "Erro interno ao atualizar usuário" });
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      const id = parseId(req.params.id as string);
      if (!id) return res.status(400).json({ message: "ID inválido" });

      const usuario = await service.buscarPorId(id);
      if (!usuario) return res.status(404).json({ message: "Usuário não encontrado" });

      await service.deletar(id);
      logger.info("Usuário deletado", { usuarioId: id, ip: req.ip });
      return res.status(204).send();
    } catch (err: any) {
      logger.error("Erro ao deletar usuário", { id: req.params.id, error: err.message });
      return res.status(500).json({ message: "Erro interno ao deletar usuário" });
    }
  }
}