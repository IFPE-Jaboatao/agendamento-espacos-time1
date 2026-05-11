import { Request, Response } from "express";
import Joi from "joi";
import { UsuarioService } from "../services/UsuarioService";
import { logger } from "../utils/logger";

const service = new UsuarioService();

/**
 * Schema de criação de usuário
 */
const usuarioCreateSchema = Joi.object({
  nome: Joi.string().min(2).max(100).required(),

  login: Joi.string().min(3).max(50).required(),

  email: Joi.string().email().required(),

  senha: Joi.string()
    .min(8)
    // senha forte: maiúscula, minúscula e número
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)"))
    .required()
    .messages({
      "string.pattern.base":
        "A senha deve conter ao menos uma letra maiúscula, uma minúscula e um número"
    }),

  perfil: Joi.string()
    .valid("admin", "usuario")
    .optional()
    .default("usuario")
});

/**
 * Schema de atualização
 */
const usuarioUpdateSchema = usuarioCreateSchema.fork(
  ["nome", "login", "email", "senha"],
  (field) => field.optional()
);

/**
 * Converte ID com segurança
 */
function parseId(param: string | string[] | undefined): number | null {
  if (!param) return null;

  const idParam = Array.isArray(param) ? param[0] : param;
  const id = Number(idParam);

  return isNaN(id) || id <= 0 ? null : id;
}

/**
 * CONTROLLER DE USUÁRIOS
 */
export class UsuarioController {

  /**
   * CRIAR USUÁRIO
   */
  async criar(req: Request, res: Response) {
    try {

      const { error, value } = usuarioCreateSchema.validate(req.body);

      if (error) {
        logger.warn("Erro ao criar usuário", {
          erro: error.details[0].message,
          ip: req.ip
        });

        return res.status(400).json({
          message: "Dados inválidos",
          details: error.details[0].message
        });
      }

      const usuario = await service.criar(value);

      logger.info("Usuário criado", {
        usuarioId: usuario.id,
        ip: req.ip
      });

      // nunca expor senha
      return res.status(201).json({
        id: usuario.id,
        nome: usuario.nome,
        login: usuario.login,
        email: usuario.email,
        perfil: usuario.perfil
      });

    } catch (err: any) {

      logger.error("Erro ao criar usuário", {
        erro: err.message
      });

      return res.status(500).json({
        message: "Erro interno ao criar usuário"
      });
    }
  }

  /**
   * LISTAR USUÁRIOS
   */
  async listar(req: Request, res: Response) {
    try {

      const usuarios = await service.listarTodos();

      logger.info("Usuários listados", {
        ip: req.ip,
        total: usuarios.length
      });

      return res.json(usuarios);

    } catch (err: any) {

      logger.error("Erro ao listar usuários", {
        erro: err.message
      });

      return res.status(500).json({
        message: "Erro interno ao listar usuários"
      });
    }
  }

  /**
   * BUSCAR POR ID
   */
  async buscarPorId(req: Request, res: Response) {
    try {

      const id = parseId(req.params.id);

      if (!id) {
        return res.status(400).json({
          message: "ID inválido"
        });
      }

      const usuario = await service.buscarPorId(id);

      return res.json(usuario);

    } catch (err: any) {

      logger.error("Erro ao buscar usuário", {
        id: req.params.id,
        erro: err.message
      });

      return res.status(500).json({
        message: "Erro interno ao buscar usuário"
      });
    }
  }

  /**
   * ATUALIZAR USUÁRIO
   */
  async atualizar(req: Request, res: Response) {
    try {

      const id = parseId(req.params.id);

      if (!id) {
        return res.status(400).json({
          message: "ID inválido"
        });
      }

      const { error, value } = usuarioUpdateSchema.validate(req.body);

      if (error) {
        logger.warn("Erro ao atualizar usuário", {
          erro: error.details[0].message,
          id
        });

        return res.status(400).json({
          message: "Dados inválidos",
          details: error.details[0].message
        });
      }

      const usuario = await service.atualizar(id, value);

      logger.info("Usuário atualizado", {
        usuarioId: id,
        ip: req.ip
      });

      return res.json(usuario);

    } catch (err: any) {

      logger.error("Erro ao atualizar usuário", {
        id: req.params.id,
        erro: err.message
      });

      return res.status(500).json({
        message: "Erro interno ao atualizar usuário"
      });
    }
  }

  /**
   * DELETAR USUÁRIO
   */
  async deletar(req: Request, res: Response) {
    try {

      const id = parseId(req.params.id);

      if (!id) {
        return res.status(400).json({
          message: "ID inválido"
        });
      }

      await service.deletar(id);

      logger.info("Usuário deletado", {
        usuarioId: id,
        ip: req.ip
      });

      return res.status(204).send();

    } catch (err: any) {

      logger.error("Erro ao deletar usuário", {
        id: req.params.id,
        erro: err.message
      });

      return res.status(500).json({
        message: "Erro interno ao deletar usuário"
      });
    }
  }
}