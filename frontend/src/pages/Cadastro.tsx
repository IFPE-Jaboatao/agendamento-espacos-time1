import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Lock, Eye, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";

export default function Cadastro() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    login: "",
    senha: "",
    confirmarSenha: "",
  });

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

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

    try {
      setCarregando(true);

      await register({
        nome: form.nome,
        email: form.email,
        login: form.login,
        senha: form.senha,
      });

      alert("Cadastro realizado com sucesso!");
      navigate("/");
    } catch (err: any) {
      setErro(
        err?.response?.data?.message ||
        err?.message ||
        "Erro ao cadastrar"
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 flex items-center justify-center p-6">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-7xl h-[820px] bg-white rounded-[35px] overflow-hidden shadow-2xl flex"
      >

        {/* ESQUERDA */}
        <div className="w-1/2 flex flex-col justify-center items-center px-16 bg-white">

          <p className="text-blue-700 font-semibold tracking-[4px] uppercase mb-3">
            Sistema de Agendamento
          </p>

          <h1 className="text-5xl font-extrabold text-black mb-10">
            CADASTRO
          </h1>

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xl"
          >

            {/* NOME */}
            <div className="relative mb-5">
              <User
                size={24}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                placeholder="Nome completo"
                value={form.nome}
                onChange={(e) =>
                  setForm({
                    ...form,
                    nome: e.target.value,
                  })
                }
                className="w-full h-16 bg-[#F7F7F7] rounded-2xl border border-gray-200 pl-14 text-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* EMAIL */}
            <div className="relative mb-5">
              <Mail
                size={24}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className="w-full h-16 bg-[#F7F7F7] rounded-2xl border border-gray-200 pl-14 text-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* LOGIN */}
            <div className="relative mb-5">
              <User
                size={24}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                placeholder="Login"
                value={form.login}
                onChange={(e) =>
                  setForm({
                    ...form,
                    login: e.target.value,
                  })
                }
                className="w-full h-16 bg-[#F7F7F7] rounded-2xl border border-gray-200 pl-14 text-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* SENHA */}
            <div className="relative mb-5">
              <Lock
                size={24}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="password"
                placeholder="Senha"
                value={form.senha}
                onChange={(e) =>
                  setForm({
                    ...form,
                    senha: e.target.value,
                  })
                }
                className="w-full h-16 bg-[#F7F7F7] rounded-2xl border border-gray-200 pl-14 pr-14 text-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />

              <Eye
                size={24}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500"
              />
            </div>

            {/* CONFIRMAR */}
            <div className="relative mb-8">
              <Lock
                size={24}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="password"
                placeholder="Confirmar senha"
                value={form.confirmarSenha}
                onChange={(e) =>
                  setForm({
                    ...form,
                    confirmarSenha: e.target.value,
                  })
                }
                className="w-full h-16 bg-[#F7F7F7] rounded-2xl border border-gray-200 pl-14 text-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {erro && (
              <div className="text-center text-red-500 mb-5">
                {erro}
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={carregando}
                className="w-[340px] h-[72px] rounded-full bg-gradient-to-r from-[#214CC9] to-[#3665E8] text-white text-2xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                {carregando
                  ? "CADASTRANDO..."
                  : "CADASTRAR"}
              </button>
            </div>

          </form>
        </div>

        {/* DIREITA */}
        <div className="relative w-1/2 overflow-hidden bg-gradient-to-br from-[#123EA8] via-[#1848BE] to-[#2655D0]">

          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5"></div>

          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-white/5"></div>

          <div className="h-full flex flex-col justify-center items-center text-white px-16">

            <CalendarDays
              size={120}
              strokeWidth={1.5}
              className="mb-10"
            />

            <h2 className="text-6xl font-bold mb-8 text-center">
              Já possui conta?
            </h2>

            <p className="text-center text-3xl leading-relaxed mb-16">
              Faça login para acessar
              <br />
              o sistema de agendamento
            </p>

            <Link
              to="/"
              className="border-[3px] border-white rounded-full px-14 py-5 text-2xl font-bold hover:bg-white hover:text-[#123EA8] transition-all duration-300"
            >
              FAZER LOGIN
            </Link>

          </div>

        </div>

      </motion.div>
    </div>
  );
}