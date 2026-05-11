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
   * Regra: valida login e senha e gera JWT
   */
  async login(login: string, senha: string) {

    // Busca usuário pelo login
    const usuario = await repo.findOne({ where: { login } });

    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    // Validação da senha criptografada
    const senhaValida = await PasswordUtil.compare(senha, usuario.senha);

    if (!senhaValida) {
      throw new Error("Senha incorreta");
    }

    // Geração do token JWT com id e perfil
    const token = jwt.sign(
      {
        id: usuario.id,
        perfil: usuario.perfil
      },
      process.env.JWT_SECRET!,
      { expiresIn: "8h" }
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
   * - perfil padrão USUARIO
   */
  async registrar(dados: Partial<Usuario>) {

    // Verifica email duplicado
    const emailExiste = await repo.findOneBy({ email: dados.email! });
    if (emailExiste) throw new Error("Email já cadastrado");

    // Verifica login duplicado
    const loginExiste = await repo.findOneBy({ login: dados.login! });
    if (loginExiste) throw new Error("Login já está em uso");

    // Criptografa senha
    dados.senha = await PasswordUtil.hash(dados.senha!);

    // Cria usuário com perfil padrão
    const usuario = repo.create({
      ...dados,
      perfil: Perfil.USUARIO
    });

    return repo.save(usuario);
  }
}