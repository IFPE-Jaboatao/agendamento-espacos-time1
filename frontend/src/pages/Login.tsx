import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, Card, Label, TextInput, Alert } from "flowbite-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ login: "", senha: "" });
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro("");

    // Validação básica no cliente
    if (!form.login.trim() || !form.senha.trim()) {
      setErro("Login e senha são obrigatórios");
      setCarregando(false);
      return;
    }

    try {
      await login(form.login, form.senha);
      navigate("/dashboard");
    } catch (err: any) {
      setErro(err.response?.data?.message || "Login ou senha inválidos");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Agendamento de Espaços
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="login">Login</Label>
            <TextInput
              id="login"
              placeholder="seu_login"
              value={form.login}
              onChange={(e) => setForm({ ...form, login: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="senha">Senha</Label>
            <TextInput
              id="senha"
              type="password"
              placeholder="••••••"
              value={form.senha}
              onChange={(e) => setForm({ ...form, senha: e.target.value })}
              required
            />
          </div>
          {erro && (
            <Alert color="failure">
              <span>{erro}</span>
            </Alert>
          )}
          <Button type="submit" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
          </Button>
          <div className="text-center mt-2">
          <Link
            to="/cadastro"
            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            Não tem conta? Cadastre-se
          </Link>
        </div>
        </form>
      </Card>
    </div>
  );
}