import { AppDataSource } from "../data-source";
import { Usuario } from "../entities/Usuario";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const repo = AppDataSource.getRepository(Usuario);

export class AuthService {

  async login(login: string, senha: string) {
    const usuario = await repo.findOne({ where: { login } });
    if (!usuario) throw new Error("Usuário não encontrado");

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) throw new Error("Senha incorreta");

    const token = jwt.sign(
      { id: usuario.id, perfil: usuario.perfil },
      process.env.JWT_SECRET!,
      { expiresIn: "8h" }
    );

    return { token, usuario: { id: usuario.id, nome: usuario.nome, perfil: usuario.perfil } };
  }

  async registrar(dados: Partial<Usuario>) {
    const senhaHash = await bcrypt.hash(dados.senha!, 10);
    const usuario = repo.create({ ...dados, senha: senhaHash });
    return repo.save(usuario);
  }
}