import { Request, Response } from "express";
import { UsuarioService } from "../services/UsuarioService";

const service = new UsuarioService();

export class UsuarioController {

  async listar(req: Request, res: Response) {
    return res.json(await service.listarTodos());
  }

  async buscarPorId(req: Request, res: Response) {
    const usuario = await service.buscarPorId(Number(req.params.id));
    if (!usuario) return res.status(404).json({ message: "Usuário não encontrado" });
    return res.json(usuario);
  }

  async atualizar(req: Request, res: Response) {
    const usuario = await service.atualizar(Number(req.params.id), req.body);
    return res.json(usuario);
  }

  async deletar(req: Request, res: Response) {
    await service.deletar(Number(req.params.id));
    return res.status(204).send();
  }
}