import { Request, Response } from "express";
import Joi from "joi";
import { AuthService } from "../services/AuthService";
import { logger } from "../utils/logger";

const service = new AuthService();

// Validation schemas
const loginSchema = Joi.object({
  login: Joi.string().min(3).max(50).required(),
  senha: Joi.string().min(6).required()
});

const registerSchema = Joi.object({
  login: Joi.string().min(3).max(50).required(),

  senha: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.min": "A senha deve ter no mínimo 6 caracteres",
      "string.empty": "A senha é obrigatória"
    }),

  nome: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),

  perfil: Joi.string()
    .valid("admin", "usuario")
    .optional()
    .default("usuario"),

  tipoUsuario: Joi.string()
    .valid("aluno", "professor", "coordenador")
    .optional()
});

export class AuthController {

  async login(req: Request, res: Response) {
    try {
      const { error, value } = loginSchema.validate(req.body);

      if (error) {
        logger.warn("Tentativa de login com dados inválidos", {
          ip: req.ip,
          details: error.details[0].message
        });

        return res.status(400).json({
          message: "Dados inválidos",
          details: error.details[0].message
        });
      }

      const { login, senha } = value;
      const resultado = await service.login(login, senha);

      logger.info("Login bem-sucedido", {
        userId: resultado.usuario.id,
        login,
        ip: req.ip
      });

      return res.json(resultado);

    } catch (err: any) {
      logger.warn("Falha no login", {
        login: req.body.login,
        ip: req.ip,
        error: err.message
      });

      return res.status(401).json({ message: err.message });
    }
  }

  async registrar(req: Request, res: Response) {
    try {
      const { error, value } = registerSchema.validate(req.body);

      if (error) {
        logger.warn("Tentativa de registro com dados inválidos", {
          ip: req.ip,
          details: error.details[0].message
        });

        return res.status(400).json({
          message: "Erro de validação",
          details: error.details[0].message
        });
      }

      const usuario = await service.registrar(value);

      logger.info("Usuário registrado", {
        userId: usuario.id,
        login: value.login,
        perfil: value.perfil,
        ip: req.ip
      });

      return res.status(201).json({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
      });

    } catch (err: any) {
      logger.error("Erro no registro", {
        login: req.body.login,
        ip: req.ip,
        error: err.message
      });

      return res.status(400).json({ message: err.message });
    }
  }
}