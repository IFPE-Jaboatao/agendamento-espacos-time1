import { Request, Response } from "express";
import { ReservaService } from "../services/ReservaService";

const service = new ReservaService();

export class ReservaController {

  async listar(req: Request, res: Response) {
    const reservas = await service.listarTodas();
    return res.json(reservas);
  }

  async buscarPorId(req: Request, res: Response) {
    const { id } = req.params;
    const reserva = await service.buscarPorId(Number(id));
    if (!reserva) return res.status(404).json({ message: "Reserva não encontrada" });
    return res.json(reserva);
  }

  async criar(req: Request, res: Response) {
    const reserva = await service.criar(req.body);
    return res.status(201).json(reserva);
  }

  async atualizar(req: Request, res: Response) {
    const { id } = req.params;
    const reserva = await service.atualizar(Number(id), req.body);
    return res.json(reserva);
  }

  async cancelar(req: Request, res: Response) {
    const { id } = req.params;
    await service.cancelar(Number(id));
    return res.status(204).send();
  }
}