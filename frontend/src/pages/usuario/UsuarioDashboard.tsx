import {
  LayoutDashboard,
  Building2,
  CalendarPlus,
  ClipboardList,
  Clock,
  LogOut
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function UsuarioDashboard() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const [dados, setDados] = useState({
    espacos: 0,
    reservas: 0,
    pendentes: 0
  });

  const [erro, setErro] = useState("");


  // Função para deslogar o usuário
  function handleLogout() {
    logout();
    navigate("/");
  }

  async function carregarDados() {
    try {
      const respostaEspacos = await api.get("/espacos");
      const respostaReservas = await api.get("/reservas");

      const minhasReservas = respostaReservas.data.filter(
        (r: any) =>
          r.solicitante?.id === usuario?.id ||
          r.usuario?.id === usuario?.id
      );

      setDados({
        espacos: respostaEspacos.data.length,
        reservas: minhasReservas.length,
        pendentes: minhasReservas.filter(
          (r: any) => r.status === "pendente"
        ).length
      });
    } catch {
      setErro("Erro ao carregar informações.");
    }
  }

  useEffect(() => {
    if (usuario) {
      carregarDados();
    }
  }, [usuario]);

  return (
    <div className="min-h-screen flex bg-slate-100">

      {/* SIDEBAR */}
      <aside className="w-72 bg-[#123EA8] text-white flex flex-col">

        <div className="p-8 border-b border-white/20">
          <h1 className="text-2xl font-bold">
            Painel do Usuário
          </h1>

          <p className="text-white/70 mt-2">
            {usuario?.nome}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2">

          <Link
            to="/dashboard"
            className="flex items-center gap-3 p-4 rounded-xl hover:bg-white/10 transition"
          >
            <LayoutDashboard size={22} />
            Dashboard
          </Link>

          <Link
            to="/espacos"
            className="flex items-center gap-3 p-4 rounded-xl hover:bg-white/10 transition"
          >
            <Building2 size={22} />
            Espaços
          </Link>

          <Link
            to="/reservas"
            className="flex items-center gap-3 p-4 rounded-xl hover:bg-white/10 transition"
          >
            <CalendarPlus size={22} />
            Nova Reserva
          </Link>

          <Link
            to="/minhas-reservas"
            className="flex items-center gap-3 p-4 rounded-xl hover:bg-white/10 transition"
          >
            <ClipboardList size={22} />
            Minhas Reservas
          </Link>

        </nav>

        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 p-4 rounded-xl flex items-center justify-center gap-2 transition"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>

      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 p-8">

        <h1 className="text-4xl font-bold text-slate-800">
          Dashboard
        </h1>

        <p className="text-slate-500 mt-2">
          Bem-vindo ao Sistema de Agendamento.
        </p>

        {erro && (
          <div className="mt-6 bg-red-100 text-red-600 p-4 rounded-xl">
            {erro}
          </div>
        )}

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center">
              <Building2
                size={40}
                className="text-blue-600"
              />

              <span className="text-4xl font-bold">
                {dados.espacos}
              </span>
            </div>

            <p className="mt-4 text-slate-600">
              Espaços Disponíveis
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center">
              <ClipboardList
                size={40}
                className="text-green-600"
              />

              <span className="text-4xl font-bold">
                {dados.reservas}
              </span>
            </div>

            <p className="mt-4 text-slate-600">
              Minhas Reservas
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center">
              <Clock
                size={40}
                className="text-orange-500"
              />

              <span className="text-4xl font-bold">
                {dados.pendentes}
              </span>
            </div>

            <p className="mt-4 text-slate-600">
              Reservas Pendentes
            </p>
          </div>

        </div>

        {/* AÇÕES RÁPIDAS */}
        <div className="mt-10 bg-white rounded-3xl shadow-lg p-8">

          <h2 className="text-2xl font-bold mb-6">
            Ações Rápidas
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            <Link
              to="/espacos"
              className="border rounded-2xl p-6 hover:bg-slate-50 transition"
            >
              <Building2
                size={45}
                className="text-blue-600 mb-4"
              />

              <h3 className="text-xl font-bold">
                Ver Espaços
              </h3>

              <p className="text-slate-500 mt-2">
                Consulte salas, laboratórios e auditórios disponíveis.
              </p>
            </Link>

            <Link
              to="/reservas"
              className="border rounded-2xl p-6 hover:bg-slate-50 transition"
            >
              <CalendarPlus
                size={45}
                className="text-green-600 mb-4"
              />

              <h3 className="text-xl font-bold">
                Nova Reserva
              </h3>

              <p className="text-slate-500 mt-2">
                Solicite uma nova reserva de espaço.
              </p>
            </Link>

            <Link
              to="/minhas-reservas"
              className="border rounded-2xl p-6 hover:bg-slate-50 transition"
            >
              <ClipboardList
                size={45}
                className="text-purple-600 mb-4"
              />

              <h3 className="text-xl font-bold">
                Minhas Reservas
              </h3>

              <p className="text-slate-500 mt-2">
                Consulte o status das suas reservas e acompanhe as solicitações.
              </p>
            </Link>

          </div>
        </div>
      </main>
    </div>
  );
}