import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Label, TextInput, Alert, Select } from "flowbite-react";
import { useAuth } from "../context/AuthContext";

export default function Cadastro() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    login: "",
    senha: "",
    confirmarSenha: "",
    tipoUsuario: "aluno",
  });

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (form.senha.length < 6) {
      setErro("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    if (form.senha !== form.confirmarSenha) {
      setErro("As senhas não coincidem");
      return;
    }

    setCarregando(true);

    try {
      await register({
        nome: form.nome,
        email: form.email,
        login: form.login,
        senha: form.senha,
        tipoUsuario: form.tipoUsuario,
        perfil: "usuario"
      });

      alert("Cadastro realizado! Faça login.");
      navigate("/");

    } catch (err: any) {
      setErro(
        err?.response?.data?.details ||
        err?.response?.data?.message ||
        err.message ||
        "Erro ao cadastrar"
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Criar Conta
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          {/* Nome */}
          <div>
            <Label htmlFor="nome" value="Nome Completo" />
            <TextInput
              id="nome"
              required
              placeholder="Digite o nome completo"
              value={form.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" value="Email" />
            <TextInput
              id="email"
              type="email"
              required
              placeholder="nome@email.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          {/* Tipo */}
          <div>
            <Label htmlFor="tipo" value="Tipo de Usuário" />
            <Select
              id="tipo"
              value={form.tipoUsuario}
              onChange={(e) => handleChange("tipoUsuario", e.target.value)}
            >
              <option value="aluno">Aluno</option>
              <option value="professor">Professor</option>
              <option value="coordenador">Coordenador</option>
            </Select>
          </div>

          {/* Login */}
          <div>
            <Label htmlFor="login" value="Login" />
            <TextInput
              id="login"
              required
              placeholder="Digite seu login"
              value={form.login}
              onChange={(e) => handleChange("login", e.target.value)}
            />
          </div>

          {/* Senha */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="senha" value="Senha" />
              <TextInput
                id="senha"
                type="password"
                required
                placeholder="Digite sua senha"
                value={form.senha}
                onChange={(e) => handleChange("senha", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="confirmar" value="Confirmar" />
              <TextInput
                id="confirmar"
                type="password"
                required
                placeholder="Confirme sua senha"
                value={form.confirmarSenha}
                onChange={(e) => handleChange("confirmarSenha", e.target.value)}
              />
            </div>
          </div>

          {erro && (
            <Alert color="failure">
              <span>{erro}</span>
            </Alert>
          )}

          <Button type="submit" disabled={carregando}>
            {carregando ? "Processando..." : "Cadastrar"}
          </Button>

          <Button type="button" color="light" onClick={() => navigate("/")}>
            Voltar
          </Button>

        </form>
      </Card>
    </div>
  );
}