import { AppDataSource } from "../data-source";
import { Reserva, StatusReserva } from "../entities/Reserva";

const repo = AppDataSource.getRepository(Reserva);

export class ReservaService {

  async listarTodas() {
    return repo.find({ relations: ["solicitante", "espaco"] });
  }

  async buscarPorId(id: number) {
    return repo.findOne({ where: { id }, relations: ["solicitante", "espaco", "historicos"] });
  }

  async criar(dados: Partial<Reserva>) {
    const reserva = repo.create(dados);
    return repo.save(reserva);
  }

  async atualizar(id: number, dados: Partial<Reserva>) {
    await repo.update(id, dados);
    return this.buscarPorId(id);
  }

  async cancelar(id: number) {
    await repo.update(id, { status: StatusReserva.CANCELADA });
  }
}