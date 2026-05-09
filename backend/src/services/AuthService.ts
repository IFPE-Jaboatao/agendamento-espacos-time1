import { AppDataSource } from "../data-source";
import { Usuario, Perfil } from "../entities/Usuario";
import jwt from "jsonwebtoken";
import { PasswordUtil } from "../utils/PasswordUtil";

// Repositório de usuários
const repo = AppDataSource.getRepository(Usuario);

/**
 * Serviço responsável por autenticação
 */
export class AuthService {

  /**
   * Realiza login do usuário
   */
  async login(login: string, senha: string) {

    // Busca usuário pelo login
    const usuario = await repo.findOne({ where: { login } });

    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    // Valida senha com hash
    const senhaValida = await PasswordUtil.compare(senha, usuario.senha);

    if (!senhaValida) {
      throw new Error("Senha incorreta");
    }

    // Gera token JWT
    const token = jwt.sign(
      { id: usuario.id, perfil: usuario.perfil },
      process.env.JWT_SECRET!,
      { expiresIn: "8h" }
    );

    // Retorna dados seguros
    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        perfil: usuario.perfil
      }
    };
  }

  /**
   * Registra novo usuário
   */
  async registrar(dados: Partial<Usuario>) {

    // Verifica duplicidade de email
    const emailExiste = await repo.findOneBy({ email: dados.email! });
    if (emailExiste) throw new Error("Email já cadastrado");

    // Verifica duplicidade de login
    const loginExiste = await repo.findOneBy({ login: dados.login! });
    if (loginExiste) throw new Error("Login já está em uso");

    // Cria usuário com senha criptografada
    const usuario = repo.create({
      ...dados,
      senha: await PasswordUtil.hash(dados.senha!),

      // força perfil padrão
      perfil: Perfil.USUARIO
    });

    return repo.save(usuario);
  }
}