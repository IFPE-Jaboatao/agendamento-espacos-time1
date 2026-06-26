import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";

import {
    LayoutDashboard,
    Building2,
    CalendarPlus,
    ClipboardList,
    LogOut,
    Users,
    Clock
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import api from "../../services/api";

// Definindo as interfaces para os tipos de dados utilizados no componente
interface Espaco {
    id: number;
    nome: string;
    capacidade: number;
    tipo: string;
    status: string;
}

// Definindo a interface para as reservas, incluindo informações sobre o espaço reservado
interface Reserva {

    id: number;
    dataInicio: string;
    dataFim: string;

    status:
    "pendente" |
    "aprovada" |
    "recusada" |
    "cancelada";

    solicitante: {
        id: number;
        nome: string;
    };

    espaco: {
        id: number;
        nome: string;
    };
}

export default function UsuarioReservas() {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();
    const [espacos, setEspacos] = useState<Espaco[]>([]);
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [espacoSelecionado, setEspacoSelecionado] = useState<Espaco | null>(null);
    const [erro, setErro] = useState("");
    const [data, setData] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFim, setHoraFim] = useState("");
    const [motivo, setMotivo] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [sucesso, setSucesso] = useState("");
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
    const [reservaConfirmada, setReservaConfirmada] = useState(false);

    const horariosDisponiveis = [
        "07:00", "07:30", "08:00", "08:30",
        "09:00", "09:30", "10:00", "10:30",
        "11:00", "11:30", "12:00", "12:30",
        "13:00", "13:30", "14:00", "14:30",
        "15:00", "15:30", "16:00", "16:30",
        "17:00", "17:30", "18:00", "18:30",
        "19:00", "19:30", "20:00", "20:30",
        "21:00", "21:30", "22:00", "22:30"
    ];


    // Gerando eventos para o calendário com base nas reservas existentes
    const eventos = reservas.map((reserva) => ({
        id: reserva.id.toString(),
        title:"Reservado",
        start: reserva.dataInicio,
        end: reserva.dataFim,
        color:
            reserva.status === "aprovada"
                ? "#16a34a"
                : "#f59e0b"

    }));


    // Função para carregar os dados de espaços e reservas do usuário
    async function carregarDados() {
        try {
            const espacosResponse = await api.get("/espacos");
            console.log(
                "ESPAÇOS:",
                espacosResponse.data
            );

            const calendarioResponse = await api.get("/reservas/calendario");

            console.log(
                "CALENDARIO:",
                calendarioResponse.data
            );

            setEspacos(
                espacosResponse.data
            );

            setReservas(
                calendarioResponse.data
            );
        } catch (err: any) {
            console.log(
                "ERRO API:",
                err.response?.data
            );

            console.log(
                "STATUS:",
                err.response?.status
            );

            setErro(
                "Erro ao carregar informações."
            );
        }
    }

    
    // useEffect para carregar os dados ao montar o componente e configurar um intervalo para atualizar os dados a cada 5 segundos
    useEffect(() => {
        carregarDados();
        const intervalo = setInterval(() => {
            carregarDados();
        }, 5000);
        return () => clearInterval(intervalo);
    }, []);


    // Função para lidar com o logout do usuário
    function handleLogout() {
        logout();
        navigate("/");
    }


    // Função para solicitar uma nova reserva
    async function solicitarReserva() {

        setErro("");
        setSucesso("");

        if (!espacoSelecionado) {
            setErro("Selecione um espaço.");
            return;
        }

        if (espacoSelecionado.status !== "ativo") {
            setErro("Este espaço está indisponível para reserva.");
            return;
        }

        if (!data) {
            setErro("Selecione uma data.");
            return;
        }

        if (!horaInicio || !horaFim) {
            setErro("Selecione o horário.");
            return;
        }

        const inicio = new Date(`${data}T${horaInicio}:00`);
        const fim = new Date(`${data}T${horaFim}:00`);

        if (inicio >= fim) {
            setErro("O horário final deve ser maior que o horário inicial.");
            return;
        }

        if (inicio.toDateString() !== fim.toDateString()) {
            setErro("A reserva deve iniciar e terminar no mesmo dia.");
            return;
        }

        const horas = (fim.getTime() - inicio.getTime()) / 3600000;

        if (
            usuario?.tipoUsuario === "aluno" &&
            horas > 2
        ) {
            setErro("Alunos podem reservar no máximo 2 horas.");
            return;
        }

        setCarregando(true);

        try {
            const atualizadas = await api.get("/reservas/calendario");
            const listaReservas = atualizadas.data;
            const conflito = listaReservas.some((r: any) => {

                if (r.espaco.id !== espacoSelecionado.id) {
                    return false;
                }

                if (
                    r.status !== "pendente" &&
                    r.status !== "aprovada"
                ) {
                    return false;
                }

                const inicioReserva = new Date(r.dataInicio);
                const fimReserva = new Date(r.dataFim);

                return (
                    inicio < fimReserva &&
                    fim > inicioReserva
                );
            });

            if (conflito) {
                setErro("Já existe uma reserva para esse horário.");
                return;
            }

            await api.post("/reservas", {
                espacoId: espacoSelecionado.id,
                dataInicio: inicio.toISOString(),
                dataFim: fim.toISOString(),
                motivo
            });

            setReservaConfirmada(true);

            setHoraInicio("");
            setHoraFim("");
            setData("");
            setMotivo("");
            setEspacoSelecionado(null);

            await carregarDados();

        } catch (err: any) {

            setErro(
                err.response?.data?.message ||
                "Erro ao solicitar reserva."
            );

        } finally {

            setCarregando(false);

        }

    }


    // Função para lidar com a seleção de horário no calendário
    function handleSelecionarHorario(info: any) {
        const inicio = new Date(info.start);
        const fim = new Date(info.end);

        setData(
            inicio.toISOString().split("T")[0]
        );

        setHoraInicio(
            inicio.toTimeString().substring(0, 5)
        );

        setHoraFim(
            fim.toTimeString().substring(0, 5)
        );

    }


    return (
        <div className="min-h-screen flex bg-slate-100">
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
                    <Link to="/dashboard" className="flex items-center gap-3 p-4 rounded-xl hover:bg-white/10">
                        <LayoutDashboard size={22} />
                        Dashboard
                    </Link>

                    <Link to="/reservas" className="flex items-center gap-3 p-4 rounded-xl bg-white/20">
                        <CalendarPlus size={22} />
                        Nova Reserva
                    </Link>

                    <Link to="/minhas-reservas" className="flex items-center gap-3 p-4 rounded-xl hover:bg-white/10">
                        <ClipboardList size={22} />
                        Minhas Reservas
                    </Link>
                </nav>

                <div className="p-4">
                    <button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 rounded-xl p-4 flex justify-center gap-2">
                        <LogOut size={20} />
                        Sair
                    </button>
                </div>

            </aside>

            <main className="flex-1 p-8">

                <h1 className="text-4xl font-bold">
                    Nova Reserva
                </h1>

                <p className="text-slate-500 mt-2">
                    Escolha um espaço disponível.
                </p>

                {erro && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-xl mt-6">
                        {erro}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
                    {espacos.map((espaco) => (

                        <div key={espaco.id} className="bg-white rounded-3xl shadow-lg p-6">
                            <div className="flex justify-between">

                                <Building2 size={45} className="text-blue-600" />

                                <span className={espaco.status === "ativo" ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                                    {espaco.status}
                                </span>

                            </div>

                            <h2 className="text-2xl font-bold mt-5">
                                {espaco.nome}
                            </h2>

                            <p className="text-slate-500 mt-2">
                                Tipo: {espaco.tipo}
                            </p>

                            <div className="flex items-center gap-2 mt-3">
                                <Users size={18} />
                                {espaco.capacidade} pessoas
                            </div>

                            <button
                                disabled={espaco.status !== "ativo"}
                                onClick={() =>
                                    setEspacoSelecionado(
                                        espaco
                                    )
                                }
                                className={`w-full mt-6 rounded-xl py-3 font-semibold transition ${espaco.status === "ativo"
                                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                            >
                                {espaco.status === "ativo"
                                    ? "Selecionar"
                                    : "Indisponível"}
                            </button>
                        </div>
                    ))}

                </div>
                {espacoSelecionado && (
                    <div className="bg-white rounded-3xl shadow-lg p-8 mt-10">
                        <h2 className="text-3xl font-bold mb-2">
                            {espacoSelecionado.nome}
                        </h2>

                        <p className="text-slate-500">
                            Escolha a data da reserva.
                        </p>

                        <div className="mt-8">
                            <label className="font-semibold">
                                Data
                            </label>

                            <div className="bg-white rounded-2xl shadow-lg p-5 mt-8">
                                <FullCalendar
                                    plugins={[
                                        dayGridPlugin,
                                        timeGridPlugin,
                                        interactionPlugin
                                    ]}

                                    locale={ptBrLocale}
                                    initialView="timeGridWeek"
                                    selectable={true}
                                    editable={false}
                                    allDaySlot={false}
                                    slotMinTime="07:00:00"
                                    slotMaxTime="22:30:00"
                                    height={700}

                                    events={
                                        eventos.filter(evento => {

                                            const reserva = reservas.find(
                                                r => r.id === Number(evento.id)
                                            );


                                            return (
                                                reserva?.espaco.id === espacoSelecionado?.id &&
                                                (
                                                    reserva.status === "pendente" ||
                                                    reserva.status === "aprovada"
                                                )
                                            );

                                        })
                                    }
                                    select={handleSelecionarHorario}
                                />

                            </div>
                        </div>

                        {data && (

                            <>
                                <h3 className="text-2xl font-bold mt-10 mb-6">
                                    Horários disponíveis
                                </h3>

                                <div className="grid grid-cols-4 md:grid-cols-6 xl:grid-cols-8 gap-4">
                                    {horariosDisponiveis.map((hora) => {

                                        const ocupado = reservas.some((r) => {
                                            const inicio = new Date(r.dataInicio);
                                            const dia = inicio.toISOString().split("T")[0];

                                            const horario = inicio
                                                .toTimeString()
                                                .substring(0, 5);

                                            return (
                                                r.espaco.id === espacoSelecionado.id &&
                                                dia === data &&
                                                horario === hora
                                            );
                                        });

                                        return (

                                            <button
                                                key={hora}
                                                disabled={ocupado}
                                                onClick={() => setHoraInicio(hora)}
                                                className={`rounded-xl p-3 transition
                                                    ${ocupado
                                                        ? "bg-red-200 cursor-not-allowed text-red-700"
                                                        : horaInicio === hora
                                                            ? "bg-blue-600 text-white"
                                                            : "bg-slate-100 hover:bg-blue-100"
                                                    }
                                                `}
                                            >

                                                <Clock
                                                    size={18}
                                                    className="mx-auto mb-2"
                                                />
                                                {hora}
                                            </button>
                                        );
                                    })}
                                </div>
                            </>

                        )}

                        {horaInicio && (
                            <div className="mt-8">

                                <label className="font-semibold">
                                    Horário Final
                                </label>

                                <select
                                    value={horaFim}
                                    onChange={(e) => setHoraFim(e.target.value)}
                                    className="w-full border rounded-xl mt-2 p-3"
                                >

                                    <option value="">
                                        Selecione
                                    </option>

                                    {horariosDisponiveis
                                        .filter(h => h > horaInicio)
                                        .map(h => (
                                            <option
                                                key={h}
                                                value={h}
                                            >
                                                {h}
                                            </option>
                                        ))}

                                </select>
                            </div>

                        )}
                        {horaFim && (

                            <div className="mt-8">
                                <label className="font-semibold">
                                    Motivo da Reserva
                                </label>

                                <input
                                    type="text"
                                    value={motivo}
                                    onChange={(e) => setMotivo(e.target.value)}
                                    placeholder="Ex.: Aula de Programação"
                                    className="w-full mt-2 border rounded-xl p-3"
                                />
                            </div>

                        )}

                        {horaFim && (

                            <div className="bg-slate-100 rounded-2xl p-6 mt-8">

                                <h3 className="text-2xl font-bold mb-5">
                                    Resumo da Reserva
                                </h3>

                                <div className="grid md:grid-cols-2 gap-5">

                                    <div>
                                        <p className="text-slate-500">
                                            Espaço
                                        </p>

                                        <p className="font-bold">
                                            {espacoSelecionado.nome}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-slate-500">
                                            Data
                                        </p>

                                        <p className="font-bold">
                                            {data}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-slate-500">
                                            Horário
                                        </p>

                                        <p className="font-bold">
                                            {horaInicio} às {horaFim}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-slate-500">
                                            Solicitante
                                        </p>

                                        <p className="font-bold">
                                            {usuario?.nome}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {sucesso && (
                            <div className="bg-green-100 text-green-700 rounded-xl p-4 mt-6">
                                {sucesso}
                            </div>
                        )}

                        {erro && (
                            <div className="bg-red-100 text-red-700 rounded-xl p-4 mt-6">
                                {erro}
                            </div>
                        )}

                        <div className="flex gap-4 mt-8">

                            <button
                                onClick={() => setMostrarConfirmacao(true)}
                                disabled={carregando}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition disabled:bg-gray-400"
                            >
                                {carregando
                                    ? "Solicitando..."
                                    : "Solicitar Reserva"}
                            </button>

                            <button
                                onClick={() => {
                                    setEspacoSelecionado(null);
                                    setData("");
                                    setHoraInicio("");
                                    setHoraFim("");
                                    setMotivo("");
                                    setErro("");
                                    setSucesso("");
                                }}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-xl transition"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}
            </main>


            {/* Modal de Confirmação */}
            {mostrarConfirmacao && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-8">
                        <h2 className="text-3xl font-bold text-center mb-6">
                            Confirmar Reserva
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-semibold">Espaço</span>
                                <span>{espacoSelecionado?.nome}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-semibold">Tipo</span>
                                <span>{espacoSelecionado?.tipo}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-semibold">Capacidade</span>
                                <span>{espacoSelecionado?.capacidade} pessoas</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-semibold">Solicitante</span>
                                <span>{usuario?.nome}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-semibold">Data</span>
                                <span>{data}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-semibold">Horário</span>
                                <span>{horaInicio} às {horaFim}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-semibold">Motivo</span>
                                <span>{motivo || "-"}</span>
                            </div>
                        </div>
                        <div className="flex justify-end gap-4 mt-8">
                            <button
                                onClick={() => setMostrarConfirmacao(false)}
                                className="px-6 py-3 rounded-xl bg-gray-300 hover:bg-gray-400 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={async () => {
                                    setMostrarConfirmacao(false);
                                    await solicitarReserva();
                                }}
                                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition"
                            >
                                Confirmar Reserva
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Reserva Confirmada */}
            {reservaConfirmada && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-5xl text-green-600">
                                ✓
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold mt-6 text-green-600">
                            Reserva Confirmada!
                        </h2>
                        <p className="text-slate-600 mt-4">
                            Sua reserva foi enviada com sucesso.
                        </p>
                        <div className="bg-slate-100 rounded-2xl p-5 mt-6 text-left">
                            <p>
                                <strong>Espaço:</strong> {espacoSelecionado?.nome}
                            </p>
                            <p className="mt-2">
                                <strong>Data:</strong> {data}
                            </p>
                            <p className="mt-2">
                                <strong>Horário:</strong> {horaInicio} às {horaFim}
                            </p>
                            <p className="mt-2">
                                <strong>Solicitante:</strong> {usuario?.nome}
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setReservaConfirmada(false);
                                navigate("/minhas-reservas");
                            }}
                            className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
                        >
                            Ver Minhas Reservas
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}