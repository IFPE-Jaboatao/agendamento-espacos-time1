import { AppDataSource } from "../data-source";
import { Espaco } from "../entities/Espaco";

const repo = AppDataSource.getRepository(Espaco);

export class EspacoService {

  async listarTodos() {
    return repo.find();
  }

  async buscarPorId(id: number) {
    return repo.findOne({ where: { id }, relations: ["reservas"] });
  }

  async criar(dados: Partial<Espaco>) {
    const espaco = repo.create(dados);
    return repo.save(espaco);
  }

  async atualizar(id: number, dados: Partial<Espaco>) {
    await repo.update(id, dados);
    return this.buscarPorId(id);
  }

  async deletar(id: number) {
    await repo.delete(id);
  }
}