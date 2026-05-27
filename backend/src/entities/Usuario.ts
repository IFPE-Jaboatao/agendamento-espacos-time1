import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn
} from "typeorm";

import { Reserva } from "./Reserva";

export enum Perfil {
  ADMIN = "admin",
  USUARIO = "usuario"
}

export enum TipoUsuario {
  ALUNO = "aluno",
  PROFESSOR = "professor",
  COORDENADOR = "coordenador"
}

@Entity("usuarios")
export class Usuario {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, length: 50 })
  login!: string;

  @Column({ length: 255 })
  senha!: string;

  @Column({ length: 100 })
  nome!: string;

  @Column({ unique: true, length: 100 })
  email!: string;

  @Column({
    type: "enum",
    enum: Perfil,
    default: Perfil.USUARIO
  })
  perfil!: Perfil;

  @Column({
    type: "enum",
    enum: TipoUsuario,
    nullable: true
  })
  tipoUsuario?: TipoUsuario;

  @CreateDateColumn({ name: "criado_em" })
  criadoEm!: Date;

  // reservas que o usuário solicitou
  @OneToMany(() => Reserva, (reserva) => reserva.solicitante)
  reservasSolicitadas!: Reserva[];

  // reservas que o usuário aprovou (se for admin)
  @OneToMany(() => Reserva, (reserva) => reserva.aprovador)
  reservasAprovadas!: Reserva[];
}