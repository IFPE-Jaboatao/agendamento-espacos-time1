import { AppDataSource } from "../data-source";
import { HistoricoReserva } from "../entities/HistoricoReserva";

// Repositório de histórico (audit log)
const repo = AppDataSource.getRepository(HistoricoReserva);

/**
 * Registra todas as mudanças de reservas
 * (auditoria do sistema)
 */
export class HistoricoReservaService {

  /**
   * Lista histórico completo
   */
  async listarTodos() {
    return repo.find({
      relations: ["reserva", "usuario"]
    });
  }

  /**
   * Busca histórico por ID
   */
  async buscarPorId(id: number) {
    return repo.findOne({
      where: { id },
      relations: ["reserva", "usuario"]
    });
  }

  /**
   * Cria registro manual de histórico
   */
  async criar(dados: Partial<HistoricoReserva>) {
    const historico = repo.create(dados);
    return repo.save(historico);
  }

  /**
   * Cria histórico automático vindo da ReservaService
   */
  async criarEntradaAutomatica(params: {
    reservaId: number;
    usuarioId: number;
    status: any;
    descricao?: string;
  }) {

    const historico = repo.create({
      reserva: { id: params.reservaId } as any,
      usuario: { id: params.usuarioId } as any,
      status: params.status,
      descricao: params.descricao
    });

    return repo.save(historico);
  }

  /**
   * Remove histórico (uso administrativo)
   */
  async deletar(id: number) {
    return repo.delete(id);
  }
}