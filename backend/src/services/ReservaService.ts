import { AppDataSource } from "../data-source";
import { Reserva, StatusReserva } from "../entities/Reserva";
import { Perfil, Usuario } from "../entities/Usuario";
import { Espaco, StatusEspaco } from "../entities/Espaco";
import { LessThan, MoreThan, Not } from "typeorm";



// Repositórios
const repo = AppDataSource.getRepository(Reserva);
const espacoRepo = AppDataSource.getRepository(Espaco);



/**
Service de reservas
 */
export class ReservaService {


  
  /**
   * LISTAR RESERVAS
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
   */
  async buscarPorId(id: number, usuario: Usuario) {

    if (!id) {
      throw new Error("ID obrigatório");
    }

    const reserva = await repo.findOne({
      where: { id },
      relations: ["solicitante", "espaco"]
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
    if (!dados.espaco?.id) {
      throw new Error("Espaço inválido");
    }

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
      status: StatusReserva.PENDENTE,
      log: "Reserva criada"
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

    if (!reserva) {
      throw new Error("Reserva não encontrada");
    }

    if (reserva.status !== StatusReserva.PENDENTE) {
      throw new Error("Reserva já foi processada");
    }

    await repo.update(id, {
      status: StatusReserva.APROVADA,
      log: `Aprovada por ${usuario.id}`,
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
      status: StatusReserva.RECUSADA,
      log: `Recusada: ${motivo}`,
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

    await repo.update(id, {
      status: StatusReserva.CANCELADA,
      log: `Reserva cancelada pelo usuário ${usuario.id}`,
      dataDecisao: new Date()
    });
    return { message: "Reserva cancelada" };
  }



  /**
   * OBTER LOG / DETALHES
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
}