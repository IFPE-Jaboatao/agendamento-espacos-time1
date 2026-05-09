import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  ManyToOne
} from "typeorm";

import { Usuario } from "./Usuario";
import { HistoricoReserva } from "./HistoricoReserva";
import { Espaco } from "./Espaco";

export enum StatusReserva {
  PENDENTE = "pendente",
  APROVADA = "aprovada",
  RECUSADA = "recusada",
  CANCELADA = "cancelada"
}

@Entity("reservas")
export class Reserva {

  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn({ name: "data_criacao" })
  dataCriacao!: Date;

  @Column({ name: "data_inicio", type: "datetime" })
  dataInicio!: Date;

  @Column({ name: "data_fim", type: "datetime" })
  dataFim!: Date;

  @Column({ length: 50, nullable: true })
  tipo?: string;

  @Column({ length: 50, nullable: true })
  motivo?: string;

  @Column({
    type: "enum",
    enum: StatusReserva,
    default: StatusReserva.PENDENTE
  })
  status!: StatusReserva;

  @Column({ type: "text", nullable: true })
  descricao?: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.reservas, { nullable: false })
  @JoinColumn({ name: "solicitante_id" })
  solicitante!: Usuario;

  @ManyToOne(() => Espaco, (espaco) => espaco.reservas, { nullable: false })
  @JoinColumn({ name: "espaco_id" })
  espaco!: Espaco;

  @OneToMany(() => HistoricoReserva, (historico) => historico.reserva)
  historicos?: HistoricoReserva[];
}