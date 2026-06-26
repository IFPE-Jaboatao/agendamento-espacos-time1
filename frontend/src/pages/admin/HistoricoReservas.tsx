import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, FileDown, X } from "lucide-react";
import api from "../../services/api";
import jsPDF from "jspdf";


export default function HistoricoReservas() {

    const navigate = useNavigate();
    const [idReserva, setIdReserva] = useState("");
    const [inicio, setInicio] = useState("");
    const [fim, setFim] = useState("");
    const [nomeUsuario, setNomeUsuario] = useState("");
    const [historico, setHistorico] = useState<any[]>([]);
    const [selecionada, setSelecionada] = useState<any>(null);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    function formatarData(data: string) {
        return new Date(data)
            .toLocaleString(
                "pt-BR"
            );
    }

    async function buscarPorId() {
        try {
            const response = await api.get(`/reservas/${idReserva}/log`);
            setHistorico([response.data]);
            setSucesso("Reserva encontrada");
        } catch (err: any) {
            setErro("Reserva não encontrada");
        }
    }

    async function buscarPeriodo() {
        setErro("");
        setSucesso("");
        if (!inicio || !fim) {
            setErro("Informe a data inicial e final");
            return;
        }
        try {
            const dataFim = new Date(fim);

            // adiciona 1 dia para incluir o dia selecionado
            dataFim.setDate(
                dataFim.getDate() + 1
            );

            const fimFormatado =
                dataFim
                    .toISOString()
                    .split("T")[0];
            const response = await api.get("/reservas/historico/periodo",
                {
                    params: {
                        inicio,
                        fim: fimFormatado
                    }
                }
            );
            setHistorico(response.data);

            setSucesso("Histórico carregado");
        } catch (error: any) {
            setErro(
                error.response?.data?.error || "Erro ao buscar histórico"
            );
        }
    }

    async function buscarUsuario() {
        try {
            const response = await api.get("/reservas/historico/usuario",
                {
                    params: {
                        nome: nomeUsuario
                    }
                }
            );
            setHistorico(response.data);
            setSucesso("Histórico do usuário carregado");
        } catch (err: any) {
            setErro("Usuário não encontrado");
        }
    }

    function gerarPDF(reserva: any) {

        const pdf = new jsPDF();
        let y = 20;

        pdf.text("Historico de Reserva", 20, y);
        y += 15;

        pdf.text(`ID: ${reserva.id}`, 20, y);
        y += 10;

        pdf.text(`Usuario: ${reserva.solicitante?.nome}`, 20, y);
        y += 10;

        pdf.text(`Espaco: ${reserva.espaco?.nome}`, 20, y);
        y += 10;

        pdf.text(`Inicio: ${formatarData(reserva.dataInicio)}`, 0, y);
        y += 10;


        pdf.text(`Fim: ${formatarData(reserva.dataFim)}`, 20, y);
        y += 10;

        pdf.text(`Motivo: ${reserva.motivo || "-"}`, 20, y);
        y += 10;

        pdf.text(`Status: ${reserva.status}`, 20, y);
        y += 10;

        pdf.text(`Aprovador: ${reserva.aprovador?.nome || "-"}`, 20, y);
        y += 15;

        pdf.text("Log:", 20, y);
        y += 10;

        (reserva.log || [])
            .forEach((item: string) => {
                pdf.text("- " + item, 20, y);
                y += 10;
            });
        pdf.save(`reserva-${reserva.id}.pdf`);
    }

    return (
        <div className="p-8 bg-slate-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">
                    Histórico de Reservas
                </h1>

                <button
                    onClick={() =>
                        navigate("/admin")
                    }
                    className="bg-slate-700 text-white px-5 py-3 rounded-xl flex gap-2 items-center">
                    <ArrowLeft size={20} />
                    Voltar
                </button>
            </div>

            {erro &&
                <div className=" bg-red-100 text-red-700 p-4 rounded-xl mb-5 ">
                    {erro}
                </div>
            }

            {sucesso &&
                <div className="bg-green-100 text-green-700 p-4 rounded-xl mb-5">
                    {sucesso}
                </div>
            }

            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow">
                    <h2 className="font-bold mb-4">Buscar por ID</h2>

                    <div className="flex gap-3">
                        <input
                            className="border rounded-xl p-3 flex-1"
                            placeholder="ID"
                            value={idReserva}
                            onChange={
                                e => setIdReserva(e.target.value)
                            }
                        />

                        <button onClick={buscarPorId} className="bg-blue-600 text-white px-5 rounded-xl">
                            <Search />
                        </button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow">
                    <h2 className="font-bold mb-4">Buscar período</h2>

                    <div className="flex gap-2">
                        <input
                            type="date"
                            className="border rounded-xl p-3"
                            value={inicio}
                            onChange={
                                e => setInicio(e.target.value)
                            }
                        />

                        <input
                            type="date"
                            className="border rounded-xl p-3"
                            value={fim}
                            onChange={
                                e => setFim(e.target.value)
                            }
                        />

                        <button onClick={buscarPeriodo} className="bg-blue-600 text-white px-5 rounded-xl">
                            <Search />
                        </button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow ">
                    <h2 className="font-bold mb-4">
                        Buscar usuário
                    </h2>

                    <div className="flex gap-3">
                        <input
                            className="border rounded-xl p-3 flex-1"
                            placeholder="Nome"
                            value={nomeUsuario}
                            onChange={
                                e => setNomeUsuario(e.target.value)
                            }
                        />

                        <button onClick={buscarUsuario} className="bg-blue-600 text-white px-5 rounded-xl">
                            <Search />
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-100">
                        <tr>
                            <th className="p-4"> ID </th>
                            <th className="p-4"> Usuário </th>
                            <th className="p-4"> Espaço </th>
                            <th className="p-4"> Status </th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            historico.map((r) =>
                                <tr key={r.id} onClick={() =>
                                    setSelecionada(r)
                                }
                                    className="border-t cursor-pointer hover:bg-slate-50"
                                >
                                    <td className="p-4"> {r.id}</td>
                                    <td className="p-4"> {r.solicitante?.nome} </td>
                                    <td className="p-4"> {r.espaco?.nome} </td>
                                    <td className="p-4"> {r.status}</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>

            {selecionada &&
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-xl">
                        <div className="flex justify-between">
                            <h2 className="text-2xl font-bold">
                                Detalhes
                            </h2>
                            <button onClick={() => setSelecionada(null)}>
                                <X />
                            </button>
                        </div>

                        <p> Usuário: {selecionada.solicitante?.nome} </p>
                        <p> Espaço: {selecionada.espaco?.nome} </p>
                        <p> Motivo: {selecionada.motivo || "-"} </p>
                        <p> Status: {selecionada.status} </p>
                        <p> Aprovador: {selecionada.aprovador?.nome || "-"} </p>

                        <div className="mt-4">
                            <h3 className="font-bold">
                                Histórico
                            </h3>
                            {
                                selecionada.log?.map(
                                    (item: string) => (
                                        <p key={item}>
                                            • {item}
                                        </p>
                                    )
                                )
                            }
                        </div>

                        <button
                            onClick={() =>
                                gerarPDF(selecionada)
                            }
                            className="mt-6 bg-red-600 text-white px-5 py-3 rounded-xl flex gap-2 ">
                            <FileDown />
                            Baixar PDF
                        </button>

                    </div>
                </div>
            }
        </div>
    )
}