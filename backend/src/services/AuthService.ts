import { AppDataSource } from "../data-source";
import { Usuario, Perfil } from "../entities/Usuario";
import jwt from "jsonwebtoken";
import { PasswordUtil } from "../utils/PasswordUtil";

// Repositório de usuários
const repo = AppDataSource.getRepository(Usuario);

/**
 * Service responsável pela autenticação e registro
 */
export class AuthService {

  /**
   * LOGIN DO USUÁRIO
   * Regras:
   * - usuário deve existir
   * - senha deve ser válida
   * - gera JWT com expiração de 8h
   */
  async login(login: string, senha: string) {

    // Valida variável JWT
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET não configurado");
    }

    // Busca usuário pelo login
    const usuario = await repo.findOne({
      where: { login }
    });

    /**
     * Mensagem genérica para evitar
     * enumeração de usuários
     */
    if (!usuario) {
      throw new Error("Login ou senha inválidos");
    }

    // Compara senha com hash
    const senhaValida = await PasswordUtil.compare(
      senha,
      usuario.senha
    );

    if (!senhaValida) {
      throw new Error("Login ou senha inválidos");
    }

    // Geração do token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        perfil: usuario.perfil
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h"
      }
    );

    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
      }
    };
  }

  /**
   * REGISTRO DE USUÁRIO
   * Regras:
   * - email único
   * - login único
   * - senha criptografada
   * - perfil sempre USUARIO
   */
  async registrar(dados: Partial<Usuario>) {

    // Validação básica
    if (!dados.nome) {
      throw new Error("Nome obrigatório");
    }

    if (!dados.email) {
      throw new Error("Email obrigatório");
    }

    if (!dados.login) {
      throw new Error("Login obrigatório");
    }

    if (!dados.senha) {
      throw new Error("Senha obrigatória");
    }

    // Verifica email duplicado
    const emailExiste = await repo.findOneBy({
      email: dados.email
    });

    if (emailExiste) {
      throw new Error("Email já cadastrado");
    }

    // Verifica login duplicado
    const loginExiste = await repo.findOneBy({
      login: dados.login
    });

    if (loginExiste) {
      throw new Error("Login já está em uso");
    }

    // Criptografa senha
    const senhaHash = await PasswordUtil.hash(dados.senha);

    // Cria usuário SEM permitir perfil externo
    const usuario = repo.create({
      nome: dados.nome,
      email: dados.email,
      login: dados.login,
      senha: senhaHash,
      perfil: Perfil.USUARIO
    });

    // Salva usuário
    const saved = await repo.save(usuario);

    // Nunca retorna senha
    return {
      id: saved.id,
      nome: saved.nome,
      email: saved.email,
      login: saved.login,
      perfil: saved.perfil
    };
  }
}