import { AppDataSource } from "../data-source";
import { Espaco, StatusEspaco } from "../entities/Espaco";
import { Perfil, Usuario } from "../entities/Usuario";

// Repositório de espaços
const repo = AppDataSource.getRepository(Espaco);

/**
 * Service de espaços físicos
 */
export class EspacoService {

  /**
   * LISTAR ESPAÇOS ATIVOS
   * Regra: só retorna espaços ativos
   */
  async listarTodos() {
    return repo.find({
      where: { status: StatusEspaco.ATIVO }
    });
  }

  /**
   * BUSCAR ESPAÇO POR ID
   * Regra: inclui reservas relacionadas
   */
  async buscarPorId(id: number) {

    const espaco = await repo.findOne({
      where: { id },
      relations: ["reservas"]
    });

    if (!espaco) throw new Error("Espaço não encontrado");

    return espaco;
  }

  /**
   * CRIAR ESPAÇO
   * Regra: apenas ADMIN pode criar
   */
  async criar(dados: Partial<Espaco>, usuario: Usuario) {

    if (usuario.perfil !== Perfil.ADMIN) {
      throw new Error("Apenas admin pode criar espaços");
    }

    return repo.save(repo.create(dados));
  }

  /**
   * ATUALIZAR ESPAÇO
   * Regra: apenas ADMIN pode atualizar
   */
  async atualizar(id: number, dados: Partial<Espaco>, usuario: Usuario) {

    if (usuario.perfil !== Perfil.ADMIN) {
      throw new Error("Apenas admin pode atualizar espaços");
    }

    await this.buscarPorId(id);
    await repo.update(id, dados);

    return this.buscarPorId(id);
  }

  /**
   * DELETAR ESPAÇO
   * Regra: apenas ADMIN pode remover
   */
  async deletar(id: number, usuario: Usuario) {

    if (usuario.perfil !== Perfil.ADMIN) {
      throw new Error("Apenas admin pode remover espaços");
    }

    await this.buscarPorId(id);
    return repo.delete(id);
  }
}