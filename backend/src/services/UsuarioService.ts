import { AppDataSource } from "../data-source";
import { Usuario, Perfil } from "../entities/Usuario";
import { PasswordUtil } from "../utils/PasswordUtil";

const repo = AppDataSource.getRepository(Usuario);

/**
 * Service de usuários
 */
export class UsuarioService {

  /**
   * CRIAR USUÁRIO
   * Regras:
   * - email único
   * - login único
   * - senha criptografada
   * - perfil padrão USUARIO (nunca definido pelo cliente)
   */
  async criar(dados: Partial<Usuario>) {

    if (!dados.nome || !dados.email || !dados.login || !dados.senha) {
      throw new Error("Dados obrigatórios faltando");
    }

    const emailExiste = await repo.findOneBy({
      email: dados.email
    });

    if (emailExiste) {
      throw new Error("Email já cadastrado");
    }

    const loginExiste = await repo.findOneBy({
      login: dados.login
    });

    if (loginExiste) {
      throw new Error("Login já cadastrado");
    }

    const senhaHash = await PasswordUtil.hash(dados.senha);

    const usuario = repo.create({
      nome: dados.nome,
      email: dados.email,
      login: dados.login,
      senha: senhaHash,
      perfil: Perfil.USUARIO
    });

    const saved = await repo.save(usuario);

    return {
      id: saved.id,
      nome: saved.nome,
      email: saved.email,
      login: saved.login,
      perfil: saved.perfil,
      tipoUsuario: saved.tipoUsuario,
      criadoEm: saved.criadoEm
    };
  }

  /**
   * LISTAR USUÁRIOS (sem senha)
   */
  async listarTodos() {

    return repo.find({
      select: {
        id: true,
        nome: true,
        login: true,
        email: true,
        perfil: true,
        tipoUsuario: true,
        criadoEm: true
      },
      order: {
        id: "ASC"
      }
    });
  }

  /**
   * BUSCAR POR ID (sem senha)
   */
  async buscarPorId(id: number) {

    if (!id) {
      throw new Error("ID obrigatório");
    }

    const usuario = await repo.findOne({
      where: { id },
      select: {
        id: true,
        nome: true,
        login: true,
        email: true,
        perfil: true,
        tipoUsuario: true,
        criadoEm: true
      }
    });

    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    return usuario;
  }

  /**
   * ATUALIZAR USUÁRIO
   */
  async atualizar(id: number, dados: Partial<Usuario>) {

    const usuario = await repo.findOneBy({ id });

    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    // impede alteração de perfil por segurança
    delete dados.perfil;

    // evita duplicidade de email
    if (dados.email && dados.email !== usuario.email) {
      const emailExiste = await repo.findOneBy({
        email: dados.email
      });

      if (emailExiste) {
        throw new Error("Email já cadastrado");
      }
    }

    // evita duplicidade de login
    if (dados.login && dados.login !== usuario.login) {
      const loginExiste = await repo.findOneBy({
        login: dados.login
      });

      if (loginExiste) {
        throw new Error("Login já cadastrado");
      }
    }

    // hash de senha se existir
    if (dados.senha) {
      dados.senha = await PasswordUtil.hash(dados.senha);
    }

    await repo.update(id, dados);

    return this.buscarPorId(id);
  }

  /**
   * DELETAR USUÁRIO
   */
  async deletar(id: number) {

    const usuario = await repo.findOneBy({ id });

    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    return repo.delete(id);
  }
}