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
exports.HistoricoReserva = exports.StatusHistorico = void 0;
const typeorm_1 = require("typeorm");
const Reserva_1 = require("./Reserva");
const Usuario_1 = require("./Usuario");
var StatusHistorico;
(function (StatusHistorico) {
    StatusHistorico["PENDENTE"] = "pendente";
    StatusHistorico["APROVADA"] = "aprovada";
    StatusHistorico["RECUSADA"] = "recusada";
    StatusHistorico["CANCELADA"] = "cancelada";
})(StatusHistorico || (exports.StatusHistorico = StatusHistorico = {}));
let HistoricoReserva = class HistoricoReserva {
};
exports.HistoricoReserva = HistoricoReserva;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], HistoricoReserva.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Date)
], HistoricoReserva.prototype, "data", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: StatusHistorico
    }),
    __metadata("design:type", String)
], HistoricoReserva.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], HistoricoReserva.prototype, "descricao", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Reserva_1.Reserva, (reserva) => reserva.historicos),
    (0, typeorm_1.JoinColumn)({ name: "reserva_id" }),
    __metadata("design:type", Reserva_1.Reserva)
], HistoricoReserva.prototype, "reserva", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Usuario_1.Usuario, (usuario) => usuario.historicos),
    (0, typeorm_1.JoinColumn)({ name: "usuario_id" }),
    __metadata("design:type", Usuario_1.Usuario)
], HistoricoReserva.prototype, "usuario", void 0);
exports.HistoricoReserva = HistoricoReserva = __decorate([
    (0, typeorm_1.Entity)("historico_reserva")
], HistoricoReserva);
