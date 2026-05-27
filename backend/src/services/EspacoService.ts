import { AppDataSource } from "../data-source";
import { Espaco, StatusEspaco } from "../entities/Espaco";
import { Perfil, Usuario } from "../entities/Usuario";
import { Reserva } from "../entities/Reserva";

// Repositórios
const repo = AppDataSource.getRepository(Espaco);
const reservaRepo = AppDataSource.getRepository(Reserva);

/**
 * Service de espaços físicos
 */
export class EspacoService {

  /**
   * Helper - valida admin
   */
  private validarAdmin(usuario: Usuario) {
    if (usuario.perfil !== Perfil.ADMIN) {
      throw new Error("Apenas admin pode executar esta ação");
    }
  }

  /**
   * LISTAR ESPAÇOS ATIVOS
   */
  async listarTodos() {
    return repo.find({
      where: {
        status: StatusEspaco.ATIVO
      },
      order: {
        id: "ASC"
      }
    });
  }

  /**
   * BUSCAR ESPAÇO POR ID
   */
  async buscarPorId(id: number) {

    if (!id) {
      throw new Error("ID obrigatório");
    }

    const espaco = await repo.findOne({
      where: { id },
      relations: ["reservas"]
    });

    if (!espaco) {
      throw new Error("Espaço não encontrado");
    }

    return espaco;
  }

  /**
   * CRIAR ESPAÇO
   */
  async criar(
    dados: Partial<Espaco>,
    usuario: Usuario
  ) {

    this.validarAdmin(usuario);

    if (!dados.nome) {
      throw new Error("Nome obrigatório");
    }

    if (!dados.tipo) {
      throw new Error("Tipo obrigatório");
    }

    if (dados.capacidade === undefined || dados.capacidade <= 0) {
      throw new Error("Capacidade inválida");
    }

    const existe = await repo.findOneBy({ nome: dados.nome });
    if (existe) {
      throw new Error("Já existe um espaço com esse nome");
    }

    const espaco = repo.create({
      ...dados,
      status: dados.status || StatusEspaco.ATIVO
    });

    return repo.save(espaco);
  }

  /**
  * ATUALIZAR ESPAÇO
  */
  async atualizar(
    id: number,
    dados: Partial<Espaco>,
    usuario: Usuario
  ) {

    this.validarAdmin(usuario);

    const espaco = await this.buscarPorId(id);

    if (
      dados.capacidade !== undefined &&
      dados.capacidade <= 0
    ) {
      throw new Error("Capacidade inválida");
    }

    if (dados.nome !== undefined && dados.nome.trim() === "") {
      throw new Error("Nome inválido");
    }

    if (
      dados.nome &&
      dados.nome !== espaco.nome
    ) {
      const nomeExiste = await repo.findOneBy({
        nome: dados.nome
      });

      if (nomeExiste) {
        throw new Error("Já existe um espaço com esse nome");
      }
    }

    await repo.update(id, {
      nome: dados.nome ?? espaco.nome,
      tipo: dados.tipo ?? espaco.tipo,
      capacidade: dados.capacidade ?? espaco.capacidade,
      status: dados.status ?? espaco.status
    });

    return this.buscarPorId(id);
  }

  /**
   * DELETAR ESPAÇO
   */
  async deletar(
    id: number,
    usuario: Usuario
  ) {

    this.validarAdmin(usuario);

    const espaco = await this.buscarPorId(id);

    const reservasAtivas = await reservaRepo.count({
      where: {
        espaco: { id },
      }
    });

    if (reservasAtivas > 0) {
      throw new Error("Não é permitido remover espaço com reservas vinculadas");
    }

    return repo.delete(id);
  }
}