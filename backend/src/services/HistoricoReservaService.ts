import { AppDataSource } from "../data-source";
import { HistoricoReserva, StatusHistorico } from "../entities/HistoricoReserva";
import { Perfil, Usuario } from "../entities/Usuario";
import { Reserva } from "../entities/Reserva";

// Repositórios
const repo = AppDataSource.getRepository(HistoricoReserva);
const reservaRepo = AppDataSource.getRepository(Reserva);

/**
 * Service de auditoria do sistema
 */
export class HistoricoReservaService {

  /**
   * LISTAR HISTÓRICO COM PERMISSÃO
   * Regra:
   * - ADMIN vê tudo
   * - USUÁRIO vê apenas seus registros
   */
  async listarComPermissao(usuario: Usuario) {

    if (usuario.perfil === Perfil.ADMIN) {
      return repo.find({
        relations: ["reserva", "usuario"],
        order: { id: "DESC" }
      });
    }

    return repo.find({
      where: {
        usuario: { id: usuario.id }
      },
      relations: ["reserva", "usuario"],
      order: { id: "DESC" }
    });
  }

  /**
   * BUSCAR POR ID
   * Regra:
   * - acesso restrito ao dono ou admin
   */
  async buscarPorId(id: number, usuario: Usuario) {

    const historico = await repo.findOne({
      where: { id },
      relations: ["reserva", "usuario"]
    });

    if (!historico) {
      throw new Error("Histórico não encontrado");
    }

    if (
      usuario.perfil !== Perfil.ADMIN &&
      historico.usuario.id !== usuario.id
    ) {
      throw new Error("Sem permissão");
    }

    return historico;
  }

  /**
   * CRIAR HISTÓRICO MANUAL
   * Regra:
   * - usado apenas por processos administrativos
   */
  async criar(dados: Partial<HistoricoReserva>) {

    if (!dados.reserva || !dados.usuario || !dados.status) {
      throw new Error("Dados obrigatórios faltando");
    }

    return repo.save(repo.create(dados));
  }

  /**
   * CRIAR HISTÓRICO AUTOMÁTICO
   * Regra:
   * - usado pelo sistema de reservas
   */
  async criarEntradaAutomatica(params: {
    reservaId: number;
    usuarioId: number;
    status: StatusHistorico;
    descricao?: string;
  }) {

    if (!params.reservaId || !params.usuarioId || !params.status) {
      throw new Error("Parâmetros inválidos");
    }

    // Valida existência da reserva
    const reserva = await reservaRepo.findOneBy({
      id: params.reservaId
    });

    if (!reserva) {
      throw new Error("Reserva não encontrada");
    }

    return repo.save(
      repo.create({
        reserva: { id: params.reservaId },
        usuario: { id: params.usuarioId },
        status: params.status,
        descricao: params.descricao ?? "",
        data: new Date()
      })
    );
  }

  /**
   * DELETAR HISTÓRICO
   * Regra:
   * - apenas ADMIN pode remover
   * - auditoria deve ser protegida
   */
  async deletar(id: number, usuario: Usuario) {

    if (usuario.perfil !== Perfil.ADMIN) {
      throw new Error("Apenas admin pode remover histórico");
    }

    const historico = await repo.findOneBy({ id });

    if (!historico) {
      throw new Error("Histórico não encontrado");
    }

    return repo.delete(id);
  }
}