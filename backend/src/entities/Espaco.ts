import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany
} from "typeorm";

import { Reserva } from "./Reserva";

export enum TipoEspaco {
  LABORATORIO = "laboratorio",
  SALA = "sala",
  AUDITORIO = "auditorio"
}

export enum StatusEspaco {
  ATIVO = "ativo",
  INATIVO = "inativo"
}

@Entity("espacos")
export class Espaco {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  nome!: string;

  @Column({ type: "int", nullable: true })
  capacidade!: number;

  @Column({
    type: "enum",
    enum: TipoEspaco
  })
  tipo!: TipoEspaco;

  @Column({ type: "text", nullable: true })
  descricao?: string;

  @Column({
    type: "enum",
    enum: StatusEspaco,
    default: StatusEspaco.ATIVO
  })
  status!: StatusEspaco;

  @OneToMany(() => Reserva, (reserva) => reserva.espaco)
  reservas?: Reserva[];
}