"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EspacoService = void 0;
const data_source_1 = require("../data-source");
const Espaco_1 = require("../entities/Espaco");
const repo = data_source_1.AppDataSource.getRepository(Espaco_1.Espaco);
class EspacoService {
    async listarTodos() {
        return repo.find();
    }
    async buscarPorId(id) {
        return repo.findOne({ where: { id }, relations: ["reservas"] });
    }
    async criar(dados) {
        const espaco = repo.create(dados);
        return repo.save(espaco);
    }
    async atualizar(id, dados) {
        await repo.update(id, dados);
        return this.buscarPorId(id);
    }
    async deletar(id) {
        await repo.delete(id);
    }
}
exports.EspacoService = EspacoService;
