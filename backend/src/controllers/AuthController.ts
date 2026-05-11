import { Request, Response } from "express";
import Joi from "joi";
import { AuthService } from "../services/AuthService";
import { logger } from "../utils/logger";

// Instância do service de autenticação
const service = new AuthService();

/**
 * Validação de login
 */
const loginSchema = Joi.object({
  login: Joi.string().min(3).max(50).required(),
  senha: Joi.string().min(6).required()
});

/**
 * Validação de registro
 * Regras:
 * - login obrigatório
 * - senha forte
 * - email válido
 */
const registerSchema = Joi.object({
  login: Joi.string().min(3).max(50).required(),

  senha: Joi.string()
    .min(8)
    // senha deve conter maiúscula, minúscula e número
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)"))
    .required()
    .messages({
      "string.pattern.base":
        "A senha deve conter ao menos uma letra maiúscula, uma minúscula e um número"
    }),

  nome: Joi.string().min(2).max(100).required(),

  email: Joi.string().email().required(),

  tipoUsuario: Joi.string()
    .valid("aluno", "professor", "coordenador")
    .optional()
});

/**
 * CONTROLLER DE AUTENTICAÇÃO
 */
export class AuthController {

  /**
   * LOGIN DO USUÁRIO
   */
  async login(req: Request, res: Response) {
    try {

      // valida entrada
      const { error, value } = loginSchema.validate(req.body);

      if (error) {
        logger.warn("Login inválido", {
          ip: req.ip,
          erro: error.details[0].message
        });

        return res.status(400).json({
          message: "Dados inválidos",
          details: error.details[0].message
        });
      }

      const { login, senha } = value;

      // chama service de autenticação
      const resultado = await service.login(login, senha);

      logger.info("Login realizado com sucesso", {
        userId: resultado.usuario.id,
        login,
        ip: req.ip
      });

      return res.json(resultado);

    } catch (err: any) {

      // erros esperados de negócio
      const errosNegocio = [
        "Usuário não encontrado",
        "Senha incorreta"
      ];

      if (errosNegocio.includes(err.message)) {
        logger.warn("Falha no login", {
          login: req.body.login,
          erro: err.message,
          ip: req.ip
        });

        return res.status(401).json({
          message: err.message
        });
      }

      // erro inesperado
      logger.error("Erro interno no login", {
        erro: err.message,
        ip: req.ip
      });

      return res.status(500).json({
        message: "Erro interno ao realizar login"
      });
    }
  }

  /**
   * REGISTRO DE USUÁRIO
   */
  async registrar(req: Request, res: Response) {
    try {

      // valida entrada
      const { error, value } = registerSchema.validate(req.body);

      if (error) {
        logger.warn("Registro inválido", {
          ip: req.ip,
          erro: error.details[0].message
        });

        return res.status(400).json({
          message: "Dados inválidos",
          details: error.details[0].message
        });
      }

      // chama service de registro
      const usuario = await service.registrar(value);

      logger.info("Usuário registrado", {
        userId: usuario.id,
        login: value.login,
        ip: req.ip
      });

      // retorna apenas dados seguros (sem senha)
      return res.status(201).json({
        id: usuario.id,
        nome: usuario.nome,
        login: usuario.login,
        email: usuario.email,
        perfil: usuario.perfil
      });

    } catch (err: any) {

      // erros esperados
      const errosNegocio = [
        "Email já cadastrado",
        "Login já está em uso"
      ];

      if (errosNegocio.includes(err.message)) {
        logger.warn("Falha no registro", {
          login: req.body.login,
          erro: err.message,
          ip: req.ip
        });

        return res.status(409).json({
          message: err.message
        });
      }

      // erro inesperado
      logger.error("Erro interno no registro", {
        erro: err.message,
        ip: req.ip
      });

      return res.status(500).json({
        message: "Erro interno ao realizar registro"
      });
    }
  }
}