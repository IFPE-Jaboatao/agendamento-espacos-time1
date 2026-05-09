import { AppDataSource } from "../data-source";
import { Usuario } from "../entities/Usuario";
import { PasswordUtil } from "../utils/PasswordUtil";

// Repositório de usuários
const repo = AppDataSource.getRepository(Usuario);

// Campos que podem ser retornados (evita senha)
const selectUsuario = [
  "id",
  "nome",
  "login",
  "email",
  "perfil",
  "criadoEm"
];

/**
 * CRUD de usuários
 */
export class UsuarioService {

  /**
   * Cria usuário
   */
  async criar(dados: Partial<Usuario>) {

    // Se tiver senha, aplica hash
    if (dados.senha) {
      dados.senha = await PasswordUtil.hash(dados.senha);
    }

    const usuario = repo.create(dados);
    return repo.save(usuario);
  }

  /**
   * Lista usuários sem senha
   */
  async listarTodos() {
    return repo.find({ select: selectUsuario });
  }

  /**
   * Busca usuário por ID
   */
  async buscarPorId(id: number) {
    return repo.findOne({
      where: { id },
      select: selectUsuario
    });
  }

  /**
   * Atualiza usuário
   */
  async atualizar(id: number, dados: Partial<Usuario>) {

    // Se atualizar senha, recriptografa
    if (dados.senha) {
      dados.senha = await PasswordUtil.hash(dados.senha);
    }

    await repo.update(id, dados);
    return this.buscarPorId(id);
  }

  /**
   * Remove usuário
   */
  async deletar(id: number) {
    return repo.delete(id);
  }
}