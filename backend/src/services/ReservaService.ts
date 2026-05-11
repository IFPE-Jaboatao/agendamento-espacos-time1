import { AppDataSource } from "../data-source";
import { Reserva, StatusReserva } from "../entities/Reserva";
import { Perfil, Usuario } from "../entities/Usuario";
import { Espaco, StatusEspaco } from "../entities/Espaco";
import { StatusHistorico } from "../entities/HistoricoReserva";
import { LessThan, MoreThan, Not } from "typeorm";
import { HistoricoReservaService } from "./HistoricoReservaService";

// Repositórios
const repo = AppDataSource.getRepository(Reserva);
const espacoRepo = AppDataSource.getRepository(Espaco);

// Serviço de histórico (auditoria)
const historicoService = new HistoricoReservaService();

/**
 * Service de reservas
 */
export class ReservaService {

  /**
   * LISTAR RESERVAS
   * Regra:
   * - ADMIN vê todas
   * - USUÁRIO vê apenas as próprias
   */
  async listarTodos(usuario: Usuario) {

    if (usuario.perfil === Perfil.ADMIN) {
      return repo.find({
        relations: ["solicitante", "espaco"],
        order: { id: "DESC" }
      });
    }

    return repo.find({
      where: {
        solicitante: { id: usuario.id }
      },
      relations: ["solicitante", "espaco"],
      order: { id: "DESC" }
    });
  }

  /**
   * BUSCAR POR ID
   * Regra:
   * - acesso restrito
   */
  async buscarPorId(id: number, usuario: Usuario) {

    if (!id) {
      throw new Error("ID obrigatório");
    }

    const reserva = await repo.findOne({
      where: { id },
      relations: ["solicitante", "espaco", "historicos"]
    });

    if (!reserva) {
      throw new Error("Reserva não encontrada");
    }

    if (
      usuario.perfil !== Perfil.ADMIN &&
      reserva.solicitante.id !== usuario.id
    ) {
      throw new Error("Sem permissão");
    }

    return reserva;
  }

  /**
   * CRIAR RESERVA
   */
  async criar(dados: Partial<Reserva>) {

    if (!dados.dataInicio || !dados.dataFim) {
      throw new Error("Datas obrigatórias");
    }

    if (!dados.solicitante || !dados.espaco) {
      throw new Error("Solicitante e espaço obrigatórios");
    }

    if (dados.dataFim <= dados.dataInicio) {
      throw new Error("Data final deve ser maior que inicial");
    }

    if (dados.dataInicio < new Date()) {
      throw new Error("Não é permitido reservar datas passadas");
    }

    // valida espaço
    const espaco = await espacoRepo.findOneBy({
      id: dados.espaco.id
    });

    if (!espaco) {
      throw new Error("Espaço não encontrado");
    }

    if (espaco.status === StatusEspaco.INATIVO) {
      throw new Error("Espaço inativo");
    }

    // conflito de horário
    const conflito = await repo.findOne({
      where: {
        espaco: { id: dados.espaco.id },
        status: Not(StatusReserva.CANCELADA),
        dataInicio: LessThan(dados.dataFim),
        dataFim: MoreThan(dados.dataInicio)
      }
    });

    if (conflito) {
      throw new Error("Já existe reserva nesse horário");
    }

    const reserva = repo.create({
      ...dados,
      status: StatusReserva.PENDENTE
    });

    const saved = await repo.save(reserva);

    // auditoria
    await historicoService.criarEntradaAutomatica({
      reservaId: saved.id,
      usuarioId: saved.solicitante.id,
      status: StatusHistorico.PENDENTE,
      descricao: "Reserva criada"
    });

    return saved;
  }

  /**
   * APROVAR RESERVA
   */
  async aprovar(id: number, usuario: Usuario) {

    if (usuario.perfil !== Perfil.ADMIN) {
      throw new Error("Apenas admin pode aprovar");
    }

    const reserva = await repo.findOneBy({ id });

    if (!reserva) {
      throw new Error("Reserva não encontrada");
    }

    if (reserva.status !== StatusReserva.PENDENTE) {
      throw new Error("Reserva já foi processada");
    }

    await repo.update(id, {
      status: StatusReserva.APROVADA
    });

    await historicoService.criarEntradaAutomatica({
      reservaId: id,
      usuarioId: usuario.id,
      status: StatusHistorico.APROVADA,
      descricao: "Reserva aprovada"
    });
  }

  /**
   * RECUSAR RESERVA
   */
  async recusar(id: number, motivo: string, usuario: Usuario) {

    if (usuario.perfil !== Perfil.ADMIN) {
      throw new Error("Apenas admin pode recusar");
    }

    if (!motivo) {
      throw new Error("Motivo obrigatório");
    }

    const reserva = await repo.findOneBy({ id });

    if (!reserva) {
      throw new Error("Reserva não encontrada");
    }

    if (reserva.status !== StatusReserva.PENDENTE) {
      throw new Error("Reserva já foi processada");
    }

    await repo.update(id, {
      status: StatusReserva.RECUSADA
    });

    await historicoService.criarEntradaAutomatica({
      reservaId: id,
      usuarioId: usuario.id,
      status: StatusHistorico.RECUSADA,
      descricao: motivo
    });
  }

  /**
   * CANCELAR RESERVA
   */
  async cancelar(id: number, usuario: Usuario) {

    const reserva = await this.buscarPorId(id, usuario);

    if (
      reserva.status === StatusReserva.CANCELADA
    ) {
      throw new Error("Reserva já cancelada");
    }

    if (
      usuario.perfil !== Perfil.ADMIN &&
      reserva.solicitante.id !== usuario.id
    ) {
      throw new Error("Sem permissão");
    }

    await repo.update(id, {
      status: StatusReserva.CANCELADA
    });

    await historicoService.criarEntradaAutomatica({
      reservaId: id,
      usuarioId: usuario.id,
      status: StatusHistorico.CANCELADA,
      descricao: "Reserva cancelada"
    });
  }
}