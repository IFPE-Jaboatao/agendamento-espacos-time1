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
   * Regra:
   * - retorna apenas espaços ativos
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
   * Regra:
   * - inclui reservas relacionadas
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
   * Regra:
   * - apenas ADMIN pode criar
   */
  async criar(
    dados: Partial<Espaco>,
    usuario: Usuario
  ) {

    // Permissão
    if (usuario.perfil !== Perfil.ADMIN) {
      throw new Error("Apenas admin pode criar espaços");
    }

    // Validações básicas
    if (!dados.nome) {
      throw new Error("Nome obrigatório");
    }

    if (!dados.tipo) {
      throw new Error("Tipo obrigatório");
    }

    if (!dados.capacidade || dados.capacidade <= 0) {
      throw new Error("Capacidade inválida");
    }

    // Cria espaço
    const espaco = repo.create({
      ...dados,
      status: dados.status || StatusEspaco.ATIVO
    });

    return repo.save(espaco);
  }

  /**
   * ATUALIZAR ESPAÇO
   * Regra:
   * - apenas ADMIN pode atualizar
   */
  async atualizar(
    id: number,
    dados: Partial<Espaco>,
    usuario: Usuario
  ) {

    // Permissão
    if (usuario.perfil !== Perfil.ADMIN) {
      throw new Error("Apenas admin pode atualizar espaços");
    }

    // Busca espaço
    const espaco = await this.buscarPorId(id);

    // Validação de capacidade
    if (
      dados.capacidade !== undefined &&
      dados.capacidade <= 0
    ) {
      throw new Error("Capacidade inválida");
    }

    // Atualiza
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
   * Regra:
   * - apenas ADMIN pode remover
   * - não remove espaço com reservas
   */
  async deletar(
    id: number,
    usuario: Usuario
  ) {

    // Permissão
    if (usuario.perfil !== Perfil.ADMIN) {
      throw new Error("Apenas admin pode remover espaços");
    }

    // Busca espaço
    const espaco = await this.buscarPorId(id);

    // Impede remoção com reservas
    if (espaco.reservas && espaco.reservas.length > 0) {
      throw new Error(
        "Não é permitido remover espaço com reservas vinculadas"
      );
    }

    return repo.delete(id);
  }
}