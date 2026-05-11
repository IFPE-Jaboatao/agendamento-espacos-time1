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
   * - perfil padrão USUARIO
   */
  async criar(dados: Partial<Usuario>) {

    const emailExiste = await repo.findOneBy({ email: dados.email! });
    if (emailExiste) throw new Error("Email já cadastrado");

    const loginExiste = await repo.findOneBy({ login: dados.login! });
    if (loginExiste) throw new Error("Login já cadastrado");

    dados.senha = await PasswordUtil.hash(dados.senha!);

    return repo.save(
      repo.create({
        ...dados,
        perfil: dados.perfil || Perfil.USUARIO
      })
    );
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
      }
    });
  }

  /**
   * BUSCAR POR ID (sem senha)
   */
  async buscarPorId(id: number) {

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

    if (!usuario) throw new Error("Usuário não encontrado");

    return usuario;
  }

  /**
   * ATUALIZAR USUÁRIO
   */
  async atualizar(id: number, dados: Partial<Usuario>) {

    const usuario = await repo.findOneBy({ id });
    if (!usuario) throw new Error("Usuário não encontrado");

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
    if (!usuario) throw new Error("Usuário não encontrado");

    return repo.delete(id);
  }
}