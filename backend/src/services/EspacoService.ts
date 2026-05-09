import { AppDataSource } from "../data-source";
import { Espaco, StatusEspaco } from "../entities/Espaco";

// Repositório de espaços
const repo = AppDataSource.getRepository(Espaco);

/**
 * Serviço de espaços físicos
 */
export class EspacoService {

  /**
   * Lista apenas espaços ativos
   */
  async listarTodos() {
    return repo.find({
      where: { status: StatusEspaco.ATIVO }
    });
  }

  /**
   * Busca espaço com reservas
   */
  async buscarPorId(id: number) {
    return repo.findOne({
      where: { id },
      relations: ["reservas"]
    });
  }

  /**
   * Cria espaço
   */
  async criar(dados: Partial<Espaco>) {
    const espaco = repo.create(dados);
    return repo.save(espaco);
  }

  /**
   * Atualiza espaço
   */
  async atualizar(id: number, dados: Partial<Espaco>) {
    await repo.update(id, dados);
    return this.buscarPorId(id);
  }

  /**
   * Remove espaço
   */
  async deletar(id: number) {
    return repo.delete(id);
  }
}