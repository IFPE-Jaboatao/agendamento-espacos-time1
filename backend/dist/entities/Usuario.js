"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = exports.TipoUsuario = exports.Perfil = void 0;
const typeorm_1 = require("typeorm");
const Reserva_1 = require("./Reserva");
const HistoricoReserva_1 = require("./HistoricoReserva");
var Perfil;
(function (Perfil) {
    Perfil["ADMIN"] = "admin";
    Perfil["USUARIO"] = "usuario";
})(Perfil || (exports.Perfil = Perfil = {}));
var TipoUsuario;
(function (TipoUsuario) {
    TipoUsuario["ALUNO"] = "aluno";
    TipoUsuario["PROFESSOR"] = "professor";
    TipoUsuario["COORDENADOR"] = "coordenador";
})(TipoUsuario || (exports.TipoUsuario = TipoUsuario = {}));
let Usuario = class Usuario {
};
exports.Usuario = Usuario;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Usuario.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 50 }),
    __metadata("design:type", String)
], Usuario.prototype, "login", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Usuario.prototype, "senha", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Usuario.prototype, "nome", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 100 }),
    __metadata("design:type", String)
], Usuario.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: Perfil,
        default: Perfil.USUARIO
    }),
    __metadata("design:type", String)
], Usuario.prototype, "perfil", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: TipoUsuario,
        nullable: true
    }),
    __metadata("design:type", String)
], Usuario.prototype, "tipoUsuario", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "criado_em" }),
    __metadata("design:type", Date)
], Usuario.prototype, "criadoEm", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Reserva_1.Reserva, (reserva) => reserva.solicitante),
    __metadata("design:type", Array)
], Usuario.prototype, "reservas", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => HistoricoReserva_1.HistoricoReserva, (historico) => historico.usuario),
    __metadata("design:type", Array)
], Usuario.prototype, "historicos", void 0);
exports.Usuario = Usuario = __decorate([
    (0, typeorm_1.Entity)("usuarios")
], Usuario);
