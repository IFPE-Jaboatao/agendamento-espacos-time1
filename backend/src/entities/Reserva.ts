import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  ManyToOne,
  Index
} from "typeorm";

import { Usuario } from "./Usuario";
import { Espaco } from "./Espaco";

export enum StatusReserva {
  PENDENTE = "pendente",
  APROVADA = "aprovada",
  RECUSADA = "recusada",
  CANCELADA = "cancelada",
  FINALIZADA = "FINALIZADA"
}

@Entity("reservas")
@Index(["espaco", "dataInicio", "dataFim"])
export class Reserva {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn({ name: "data_criacao" })
  dataCriacao!: Date;

  @Column({ name: "data_inicio", type: "timestamp" })
  dataInicio!: Date;

  @Column({ name: "data_fim", type: "timestamp" })
  dataFim!: Date;

  @Column({
    type: "enum",
    enum: StatusReserva,
    default: StatusReserva.PENDENTE
  })
  status!: StatusReserva;

  @Column({ length: 100, nullable: true })
  motivo?: string;

  @Column({ type: "text", nullable: true })
  descricao?: string;

  @Column({ type: "timestamp", nullable: true })
  dataAprovacao?: Date;

  @Column({ type: "timestamp", nullable: true })
  dataRecusa?: Date;

  @Column({ type: "timestamp", nullable: true })
  dataCancelamento?: Date;

  @Column({ type: "simple-array", nullable: true })
  log?: string[];

  @Column({
    name: "data_decisao",
    type: "timestamp",
    nullable: true
  })
  dataDecisao?: Date;

  // quem solicitou
  @ManyToOne(() => Usuario, (usuario) => usuario.reservasSolicitadas, {
    nullable: false,
    onDelete: "CASCADE"
  })
  @JoinColumn({ name: "solicitante_id" })
  solicitante!: Usuario;

  // quem aprovou/rejeitou
  @ManyToOne(() => Usuario, (usuario) => usuario.reservasAprovadas, {
    nullable: true,
    onDelete: "SET NULL"
  })
  @JoinColumn({ name: "aprovador_id" })
  aprovador?: Usuario;

  // espaço reservado
  @ManyToOne(() => Espaco, (espaco) => espaco.reservas, {
    nullable: false,
    onDelete: "RESTRICT"
  })
  @JoinColumn({ name: "espaco_id" })
  espaco!: Espaco;
}