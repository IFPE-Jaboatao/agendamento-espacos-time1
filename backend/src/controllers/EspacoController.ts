import { Request, Response } from "express";
import { EspacoService } from "../services/EspacoService";

const service = new EspacoService();

export class EspacoController {

  async listar(req: Request, res: Response) {
    return res.json(await service.listarTodos());
  }

  async buscarPorId(req: Request, res: Response) {
    const espaco = await service.buscarPorId(Number(req.params.id));
    if (!espaco) return res.status(404).json({ message: "Espaço não encontrado" });
    return res.json(espaco);
  }

  async criar(req: Request, res: Response) {
    const espaco = await service.criar(req.body);
    return res.status(201).json(espaco);
  }

  async atualizar(req: Request, res: Response) {
    const espaco = await service.atualizar(Number(req.params.id), req.body);
    return res.json(espaco);
  }

  async deletar(req: Request, res: Response) {
    await service.deletar(Number(req.params.id));
    return res.status(204).send();
  }
}