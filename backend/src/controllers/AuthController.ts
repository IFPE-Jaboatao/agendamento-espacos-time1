import { Request, Response } from "express";
import Joi from "joi";
import { AuthService } from "../services/AuthService";
import { logger } from "../utils/logger";

const service = new AuthService();

const loginSchema = Joi.object({
  login: Joi.string().min(3).max(50).required(),
  senha: Joi.string().min(6).required()
});

const registerSchema = Joi.object({
  login: Joi.string().min(3).max(50).required(),
  senha: Joi.string().min(8).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)")).required()
    .messages({ "string.pattern.base": "A senha deve conter ao menos uma letra maiúscula, uma minúscula e um número" }),
  nome: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  tipoUsuario: Joi.string().valid("aluno", "professor", "coordenador").optional()
});

export class AuthController {

  async login(req: Request, res: Response) {
    try {
      const { error, value } = loginSchema.validate(req.body);
      if (error) {
        logger.warn("Tentativa de login com dados inválidos", {
          ip: req.ip,
          userAgent: req.get("User-Agent"),
          details: error.details[0].message
        });
        return res.status(400).json({ message: "Dados inválidos", details: error.details[0].message });
      }

      const { login, senha } = value;
      const resultado = await service.login(login, senha);

      logger.info("Login bem-sucedido", { userId: resultado.usuario.id, login, ip: req.ip });
      return res.json(resultado);

    } catch (err: any) {
      //Erro usuário não encontrado, senha incorreta
      const errosDeNegocio = ["Usuário não encontrado", "Senha incorreta"];
      if (errosDeNegocio.includes(err.message)) {
        logger.warn("Falha no login", { login: req.body.login, ip: req.ip, error: err.message });
        return res.status(401).json({ message: err.message });
      }
      logger.error("Erro interno no login", { login: req.body.login, ip: req.ip, error: err.message });
      return res.status(500).json({ message: "Erro interno ao realizar login" });
    }
  }

  async registrar(req: Request, res: Response) {
    try {
      const { error, value } = registerSchema.validate(req.body);
      if (error) {
        logger.warn("Tentativa de registro com dados inválidos", {
          ip: req.ip,
          userAgent: req.get("User-Agent"),
          details: error.details[0].message
        });
        return res.status(400).json({ message: "Dados inválidos", details: error.details[0].message });
      }

      const usuario = await service.registrar(value);

      logger.info("Usuário registrado", { userId: usuario.id, login: value.login, ip: req.ip });
      return res.status(201).json({
        id: usuario.id,
        nome: usuario.nome,
        login: usuario.login,
        email: usuario.email,
        perfil: usuario.perfil
      });

    } catch (err: any) {
      // Erros de negócio conhecidos (duplicidade)
      const errosDeNegocio = ["Email já cadastrado", "Login já está em uso"];
      if (errosDeNegocio.includes(err.message)) {
        logger.warn("Falha no registro", { login: req.body.login, ip: req.ip, error: err.message });
        return res.status(409).json({ message: err.message }); 
      }

      // Erro inesperado
      logger.error("Erro interno no registro", { login: req.body.login, ip: req.ip, error: err.message });
      return res.status(500).json({ message: "Erro interno ao realizar registro" });
    }
  }
}