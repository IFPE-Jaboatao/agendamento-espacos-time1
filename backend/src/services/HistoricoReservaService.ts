import { AppDataSource } from "../data-source";
import { HistoricoReserva, StatusHistorico } from "../entities/HistoricoReserva";
import { Perfil, Usuario } from "../entities/Usuario";

// Repositório de histórico (auditoria)
const repo = AppDataSource.getRepository(HistoricoReserva);

/**
 * Service de auditoria do sistema
 */
export class HistoricoReservaService {

  /**
   * LISTAR HISTÓRICO
   * Regra:
   * - ADMIN vê tudo
   * - USUÁRIO vê apenas seus registros
   */
  async listarComPermissao(usuario: Usuario) {

    if (usuario.perfil === Perfil.ADMIN) {
      return repo.find({ relations: ["reserva", "usuario"] });
    }

    return repo.find({
      where: { usuario: { id: usuario.id } },
      relations: ["reserva", "usuario"]
    });
  }

  /**
   * BUSCAR POR ID
   * Regra: acesso restrito ao dono ou admin
   */
  async buscarPorId(id: number, usuario: Usuario) {

    const historico = await repo.findOne({
      where: { id },
      relations: ["reserva", "usuario"]
    });

    if (!historico) throw new Error("Histórico não encontrado");

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
   */
  async criar(dados: Partial<HistoricoReserva>) {
    return repo.save(repo.create(dados));
  }

  /**
   * CRIAR HISTÓRICO AUTOMÁTICO
   * Regra: usado pelo sistema de reservas
   */
  async criarEntradaAutomatica(params: {
    reservaId: number;
    usuarioId: number;
    status: StatusHistorico;
    descricao?: string;
  }) {

    return repo.save(
      repo.create({
        reserva: { id: params.reservaId },
        usuario: { id: params.usuarioId },
        status: params.status,
        descricao: params.descricao
      })
    );
  }

  /**
   * DELETAR HISTÓRICO
   * Regra: apenas ADMIN pode remover
   */
  async deletar(id: number, usuario: Usuario) {

    if (usuario.perfil !== Perfil.ADMIN) {
      throw new Error("Apenas admin pode remover histórico");
    }

    return repo.delete(id);
  }
}