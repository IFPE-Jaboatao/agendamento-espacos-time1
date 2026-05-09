import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn
} from "typeorm";

import { Reserva } from "./Reserva";
import { Usuario } from "./Usuario";

export enum StatusHistorico {
  PENDENTE = "pendente",
  APROVADA = "aprovada",
  RECUSADA = "recusada",
  CANCELADA = "cancelada"
}

@Entity("historico_reserva")
export class HistoricoReserva {

  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn({ type: "timestamp" })
  data!: Date;

  @Column({
    type: "enum",
    enum: StatusHistorico
  })
  status!: StatusHistorico;

  @Column({ type: "text", nullable: true })
  descricao?: string;

  @ManyToOne(() => Reserva, (reserva) => reserva.historicos)
  @JoinColumn({ name: "reserva_id" })
  reserva!: Reserva;

  @ManyToOne(() => Usuario, (usuario) => usuario.historicos)
  @JoinColumn({ name: "usuario_id" })
  usuario!: Usuario;
}