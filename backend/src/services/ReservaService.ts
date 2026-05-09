import { AppDataSource } from "../data-source";
import { Reserva, StatusReserva } from "../entities/Reserva";
import { HistoricoReservaService } from "./HistoricoReservaService";

// Repositório de reservas
const repo = AppDataSource.getRepository(Reserva);

// Serviço de histórico (audit log)
const historicoService = new HistoricoReservaService();

/**
 * Serviço de reservas de espaços
 */
export class ReservaService {

  /**
   * Lista todas as reservas
   */
  async listarTodas() {
    return repo.find({
      relations: ["solicitante", "espaco"]
    });
  }

  /**
   * Busca reserva completa
   */
  async buscarPorId(id: number) {
    return repo.findOne({
      where: { id },
      relations: ["solicitante", "espaco", "historicos"]
    });
  }

  /**
   * Cria reserva e gera histórico automático
   */
  async criar(dados: Partial<Reserva>) {

    const reserva = repo.create(dados);
    const saved = await repo.save(reserva);

    // Log automático da criação
    await historicoService.criarEntradaAutomatica({
      reservaId: saved.id,
      usuarioId: saved.solicitante.id,
      status: "pendente" as any,
      descricao: "Reserva criada"
    });

    return saved;
  }

  /**
   * Atualiza reserva
   */
  async atualizar(id: number, dados: Partial<Reserva>) {
    await repo.update(id, dados);
    return this.buscarPorId(id);
  }

  /**
   * Cancela reserva e registra histórico
   */
  async cancelar(id: number) {

    await repo.update(id, { status: StatusReserva.CANCELADA });

    const reserva = await this.buscarPorId(id);

    await historicoService.criarEntradaAutomatica({
      reservaId: id,
      usuarioId: reserva!.solicitante.id,
      status: "cancelada" as any,
      descricao: "Reserva cancelada"
    });
  }
}