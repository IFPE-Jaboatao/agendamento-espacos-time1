import {
  Users,
  Building2,
  CalendarCheck,
  Clock,
  LogOut,
  LayoutDashboard,
  History,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminDashboard() {

  const [dados, setDados] = useState({
    usuarios: 0,
    espacos: 0,
    reservas: 0,
    pendentes: 0
  });


  const [erro, setErro] = useState("");

  const { logout, usuario } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  async function carregarDados() {
    try {
      const usuarios = await api.get("/usuarios");
      const espacos = await api.get("/espacos");
      const reservas = await api.get("/reservas");

      setDados({
        usuarios: usuarios.data.length,
        espacos: espacos.data.length,
        reservas: reservas.data.length,
        pendentes:
          reservas.data.filter(
            (r: any) => r.status === "pendente"
          ).length
      });
    } catch (error) {
      setErro(
        "Erro ao carregar dados"
      );
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <div className="min-h-screen flex bg-slate-100">

      {/* SIDEBAR */}
      <aside className="w-72 bg-[#123EA8] text-white flex flex-col">

        <div className="p-8 border-b border-white/20">
          <h1 className="text-2xl font-bold">
            Painel Admin
          </h1>

          <p className="text-white/70 mt-2">
            {usuario?.nome}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2">

          <Link
            to="/admin"
            className="flex items-center gap-3 p-4 rounded-xl hover:bg-white/10 transition"
          >
            <LayoutDashboard size={22} />
            Dashboard
          </Link>

          <Link
            to="/admin/usuarios"
            className="flex items-center gap-3 p-4 rounded-xl hover:bg-white/10 transition"
          >
            <Users size={22} />
            Usuários
          </Link>

          <Link
            to="/admin/espacos"
            className="flex items-center gap-3 p-4 rounded-xl hover:bg-white/10 transition"
          >
            <Building2 size={22} />
            Espaços
          </Link>

          <Link
            to="/admin/reservas"
            className="flex items-center gap-3 p-4 rounded-xl hover:bg-white/10 transition"
          >
            <CalendarCheck size={22} />
            Reservas
          </Link>

          <Link
            to="/admin/historico"
            className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-white/10 transition"
          >
            <History size={22} />
            Histórico
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
          Dashboard Administrativo
        </h1>

        <p className="text-slate-500 mt-2">
          Gerencie usuários, espaços e reservas.
        </p>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center">
              <Users size={40} className="text-blue-600" />
              <span className="text-4xl font-bold">
                {dados.usuarios}
              </span>
            </div>

            <p className="mt-4 text-slate-600">
              Usuários
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center">
              <Building2 size={40} className="text-green-600" />
              <span className="text-4xl font-bold">
                {dados.espacos}
              </span>
            </div>

            <p className="mt-4 text-slate-600">
              Espaços
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center">
              <CalendarCheck size={40} className="text-purple-600" />
              <span className="text-4xl font-bold">
                {dados.reservas}
              </span>
            </div>

            <p className="mt-4 text-slate-600">
              Reservas
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center">
              <Clock size={40} className="text-orange-500" />
              <span className="text-4xl font-bold">
                {dados.pendentes}
              </span>
            </div>

            <p className="mt-4 text-slate-600">
              Pendentes
            </p>
          </div>

        </div>

        {/* ÚLTIMAS RESERVAS */}
        <div className="mt-10 bg-white rounded-3xl shadow-lg p-8">

          <h2 className="text-2xl font-bold mb-4">
            Últimas Reservas
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">
                    Usuário
                  </th>

                  <th className="text-left p-4">
                    Espaço
                  </th>

                  <th className="text-left p-4">
                    Data
                  </th>

                  <th className="text-left p-4">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="p-4">
                    Nenhuma reserva encontrada
                  </td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>

            </table>

          </div>

        </div>

      </main>

    </div>
  );
}