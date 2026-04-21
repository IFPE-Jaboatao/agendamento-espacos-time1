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
exports.Espaco = exports.StatusEspaco = exports.TipoEspaco = void 0;
const typeorm_1 = require("typeorm");
const Reserva_1 = require("./Reserva");
var TipoEspaco;
(function (TipoEspaco) {
    TipoEspaco["LABORATORIO"] = "laboratorio";
    TipoEspaco["SALA"] = "sala";
    TipoEspaco["AUDITORIO"] = "auditorio";
})(TipoEspaco || (exports.TipoEspaco = TipoEspaco = {}));
var StatusEspaco;
(function (StatusEspaco) {
    StatusEspaco["ATIVO"] = "ativo";
    StatusEspaco["INATIVO"] = "inativo";
})(StatusEspaco || (exports.StatusEspaco = StatusEspaco = {}));
let Espaco = class Espaco {
};
exports.Espaco = Espaco;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Espaco.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Espaco.prototype, "nome", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", nullable: true }),
    __metadata("design:type", Number)
], Espaco.prototype, "capacidade", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: TipoEspaco
    }),
    __metadata("design:type", String)
], Espaco.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Espaco.prototype, "descricao", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: StatusEspaco,
        default: StatusEspaco.ATIVO
    }),
    __metadata("design:type", String)
], Espaco.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Reserva_1.Reserva, (reserva) => reserva.espaco),
    __metadata("design:type", Array)
], Espaco.prototype, "reservas", void 0);
exports.Espaco = Espaco = __decorate([
    (0, typeorm_1.Entity)("espacos")
], Espaco);
