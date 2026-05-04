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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

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
      setErro(err.response?.data?.message || "Erro ao cadastrar");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Criar Conta</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          
          {/* Nome */}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="nome" value="Nome Completo" />
            </div>
            <TextInput 
              id="nome"
              type="text"
              required 
              placeholder="Ex: João Silva"
              value={form.nome} 
              onChange={(e) => setForm({...form, nome: e.target.value})} 
            />
          </div>

          {/* Email */}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Email" />
            </div>
            <TextInput 
              id="email"
              type="email" 
              required 
              placeholder="nome@email.com"
              value={form.email} 
              onChange={(e) => setForm({...form, email: e.target.value})} 
            />
          </div>

          {/* Tipo de Usuário */}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="tipo" value="Tipo de Usuário" />
            </div>
            <Select 
              id="tipo"
              required
              value={form.tipoUsuario} 
              onChange={(e) => setForm({...form, tipoUsuario: e.target.value})}
            >
              <option value="aluno">Aluno</option>
              <option value="professor">Professor</option>
              <option value="coordenador">Coordenador</option>
            </Select>
          </div>

          {/* Login */}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="login" value="Login (Usuário)" />
            </div>
            <TextInput 
              id="login"
              type="text"
              required 
              placeholder="Escolha um nome de usuário"
              value={form.login} 
              onChange={(e) => setForm({...form, login: e.target.value})} 
            />
          </div>

          {/* Senhas */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="senha" value="Senha" />
              </div>
              <TextInput 
                id="senha"
                type="password" 
                required 
                placeholder="••••••••"
                value={form.senha} 
                onChange={(e) => setForm({...form, senha: e.target.value})} 
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="confirmar" value="Confirmar" />
              </div>
              <TextInput 
                id="confirmar"
                type="password" 
                required 
                placeholder="••••••••"
                value={form.confirmarSenha} 
                onChange={(e) => setForm({...form, confirmarSenha: e.target.value})} 
              />
            </div>
          </div>

          {erro && (
            <Alert color="failure">
              <span>{erro}</span>
            </Alert>
          )}

          <Button type="submit" disabled={carregando} className="mt-2">
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