import { AppDataSource } from "../data-source";
import { Usuario } from "../entities/Usuario";
import bcrypt from "bcrypt";

const repo = AppDataSource.getRepository(Usuario);

export class UsuarioService {

  async criar(dados: Partial<Usuario>) {
    if (dados.senha) {
      dados.senha = await bcrypt.hash(dados.senha, 10);
    }

    const novoUsuario = repo.create(dados);

    return await repo.save(novoUsuario);
  }

  async listarTodos() {
    return repo.find({ select: ["id", "nome", "login", "email", "perfil", "criadoEm"] });
  }

  async buscarPorId(id: number) {
    return repo.findOne({ where: { id }, select: ["id", "nome", "login", "email", "perfil", "criadoEm"] });
  }

  async atualizar(id: number, dados: Partial<Usuario>) {
    if (dados.senha) dados.senha = await bcrypt.hash(dados.senha, 10);
    await repo.update(id, dados);
    return this.buscarPorId(id);
  }

  async deletar(id: number) {
    await repo.delete(id);
  }
}