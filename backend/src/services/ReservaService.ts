import { AppDataSource } from "../data-source";
import { Reserva, StatusReserva } from "../entities/Reserva";
import { Perfil, Usuario } from "../entities/Usuario";
import { Espaco, StatusEspaco } from "../entities/Espaco";
import { LessThan, MoreThan, Not, Between, In } from "typeorm";

// Repositórios
const repo = AppDataSource.getRepository(Reserva);
const espacoRepo = AppDataSource.getRepository(Espaco);

/**
 * Service de reservas
 */
export class ReservaService {

  /**
   * LISTAR RESERVAS
   */
  async listarTodos(usuario: Usuario) {

    return repo.find({
      relations: [
        "solicitante",
        "espaco"
      ],

      order: {
        id: "DESC"
      }
    });
  }

  /**
   * BUSCAR POR ID
   */
  async buscarPorId(id: number, usuario: Usuario) {

    if (!id) throw new Error("ID obrigatório");

    const reserva = await repo.findOne({
      where: { id },
      relations: ["solicitante", "espaco"]
    });

    if (!reserva) throw new Error("Reserva não encontrada");

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

    if (!dados.solicitante || !dados.espaco?.id) {
      throw new Error("Solicitante e espaço obrigatórios");
    }

    if (dados.dataFim <= dados.dataInicio) {
      throw new Error("Data final deve ser maior que inicial");
    }

    if (dados.dataInicio < new Date()) {
      throw new Error("Não é permitido reservar datas passadas");
    }

    const espaco = await espacoRepo.findOneBy({ id: dados.espaco.id });

    if (!espaco) throw new Error("Espaço não encontrado");

    if (espaco.status === StatusEspaco.INATIVO) {
      throw new Error("Espaço inativo");
    }

    const conflito = await repo.findOne({
      where: {
        espaco: { id: dados.espaco.id },
        status: In([
          StatusReserva.PENDENTE,
          StatusReserva.APROVADA
        ]),
        dataInicio: LessThan(dados.dataFim),
        dataFim: MoreThan(dados.dataInicio)
      }
    });

    if (conflito) {
      throw new Error("Já existe reserva nesse horário");
    }

    const reserva = repo.create({
      ...dados,
      status: StatusReserva.PENDENTE,
      log: ["Reserva criada"]
    });

    return await repo.save(reserva);
  }

  /**
   * APROVAR RESERVA
   */
  async aprovar(id: number, usuario: Usuario) {

    if (usuario.perfil !== Perfil.ADMIN) {
      throw new Error("Apenas admin pode aprovar");
    }

    const reserva = await repo.findOneBy({ id });
    if (!reserva) throw new Error("Reserva não encontrada");

    if (reserva.status !== StatusReserva.PENDENTE) {
      throw new Error("Reserva já foi processada");
    }

    const novoLog = [...(reserva.log ?? [])];
    novoLog.push(`Aprovada por ${usuario.id}`);

    await repo.save({
      ...reserva,
      status: StatusReserva.APROVADA,
      aprovador: usuario,
      log: novoLog,
      dataAprovacao: new Date(),
      dataDecisao: new Date()
    });

    return { message: "Reserva aprovada" };
  }

  /**
   * RECUSAR RESERVA
   */
  async recusar(id: number, motivo: string, usuario: Usuario) {

    if (usuario.perfil !== Perfil.ADMIN) {
      throw new Error("Apenas admin pode recusar");
    }

    if (!motivo) throw new Error("Motivo obrigatório");

    const reserva = await repo.findOneBy({ id });
    if (!reserva) throw new Error("Reserva não encontrada");

    if (reserva.status !== StatusReserva.PENDENTE) {
      throw new Error("Reserva já foi processada");
    }

    const novoLog = [...(reserva.log ?? [])];
    novoLog.push(`Recusada: ${motivo}`);

    await repo.save({
      ...reserva,
      status: StatusReserva.RECUSADA,
      aprovador: usuario,
      log: novoLog,
      dataRecusa: new Date(),
      dataDecisao: new Date()
    });

    return { message: "Reserva recusada" };
  }

  /**
   * CANCELAR RESERVA
   */
  async cancelar(id: number, usuario: Usuario) {

    const reserva = await this.buscarPorId(id, usuario);

    const isOwner = reserva.solicitante.id === usuario.id;
    const isAdmin = usuario.perfil === Perfil.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new Error("Sem permissão");
    }

    if (reserva.status === StatusReserva.CANCELADA) {
      throw new Error("Reserva já cancelada");
    }

    const novoLog = [...(reserva.log ?? [])];
    novoLog.push(`Cancelada pelo usuário ${usuario.id}`);

    await repo.save({
      ...reserva,
      status: StatusReserva.CANCELADA,
      log: novoLog,
      dataCancelamento: new Date(),
      dataDecisao: new Date()
    });

    return { message: "Reserva cancelada" };
  }

  /**
   * OBTER LOG
   */
  async obterLog(id: number, usuario: Usuario) {

    const reserva = await this.buscarPorId(id, usuario);

    return {
      id: reserva.id,
      status: reserva.status,
      descricao: reserva.descricao,
      log: reserva.log,
      dataCriacao: reserva.dataCriacao,
      dataDecisao: reserva.dataDecisao
    };
  }

  /**
   * HISTÓRICO POR PERÍODO
   */
  async historicoPorPeriodo(inicio: Date, fim: Date, usuario: Usuario) {

    if (!inicio || !fim) {
      throw new Error("Datas obrigatórias");
    }

    if (inicio > fim) {
      throw new Error("Data inicial não pode ser maior que a final");
    }

    const where: any = {
      dataCriacao: Between(inicio, fim)
    };

    if (usuario.perfil !== Perfil.ADMIN) {
      where.solicitante = { id: usuario.id };
    }

    return repo.find({
      where,
      relations: ["solicitante", "espaco"],
      order: { dataCriacao: "DESC" }
    });
  }
}