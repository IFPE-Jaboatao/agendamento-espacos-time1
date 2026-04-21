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
exports.Reserva = exports.StatusReserva = void 0;
const typeorm_1 = require("typeorm");
const Usuario_1 = require("./Usuario");
const HistoricoReserva_1 = require("./HistoricoReserva");
const Espaco_1 = require("./Espaco");
var StatusReserva;
(function (StatusReserva) {
    StatusReserva["PENDENTE"] = "pendente";
    StatusReserva["APROVADA"] = "aprovada";
    StatusReserva["RECUSADA"] = "recusada";
    StatusReserva["CANCELADA"] = "cancelada";
})(StatusReserva || (exports.StatusReserva = StatusReserva = {}));
let Reserva = class Reserva {
};
exports.Reserva = Reserva;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Reserva.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: "data_criacao" }),
    __metadata("design:type", Date)
], Reserva.prototype, "dataCriacao", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "data_inicio", type: "datetime" }),
    __metadata("design:type", Date)
], Reserva.prototype, "dataInicio", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "data_fim", type: "datetime" }),
    __metadata("design:type", Date)
], Reserva.prototype, "dataFim", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Reserva.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Reserva.prototype, "motivo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: StatusReserva,
        default: StatusReserva.PENDENTE
    }),
    __metadata("design:type", String)
], Reserva.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Reserva.prototype, "descricao", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Usuario_1.Usuario, (usuario) => usuario.reservas, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: "solicitante_id" }),
    __metadata("design:type", Usuario_1.Usuario)
], Reserva.prototype, "solicitante", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Espaco_1.Espaco, (espaco) => espaco.reservas, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: "espaco_id" }),
    __metadata("design:type", Espaco_1.Espaco)
], Reserva.prototype, "espaco", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => HistoricoReserva_1.HistoricoReserva, (historico) => historico.reserva),
    __metadata("design:type", Array)
], Reserva.prototype, "historicos", void 0);
exports.Reserva = Reserva = __decorate([
    (0, typeorm_1.Entity)("reservas")
], Reserva);
