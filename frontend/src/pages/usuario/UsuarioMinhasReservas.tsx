import { useEffect, useState } from "react";
import { ArrowLeft, Eye, FileDown, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { jsPDF } from "jspdf";

// Definição da interface para representar uma reserva
interface Reserva {
    id: number;
    dataInicio: string;
    dataFim: string;
    status: string;
    motivo?: string;
    espaco: {
        id: number;
        nome: string;
        tipo: string;
    };
}

export default function UsuarioReservas() {

    const { usuario } = useAuth();
    const navigate = useNavigate();
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [reservasOriginais, setReservasOriginais] = useState<Reserva[]>([]);
    const [reservaSelecionada, setReservaSelecionada] = useState<Reserva | null>(null);
    const [idBusca, setIdBusca] = useState("");
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [erro, setErro] = useState("");


    // Função para carregar reservas do usuário
    async function carregarReservas() {
        try {
            const response = await api.get("/reservas");

            const minhas = response.data.filter((reserva: any) => {
                return reserva.solicitante?.id === usuario?.id;
            });

            setReservas(minhas);
            setReservasOriginais(response.data);
        } catch {
            setErro(
                "Erro ao carregar reservas"
            );
        }
    }
    
    useEffect(() => {
        if (usuario) {
            carregarReservas();
        }
    }, [usuario]);


    // Função para buscar reservas com base nos filtros aplicados
    function buscar() {

        let lista = [...reservasOriginais];

        // Busca por ID
        if (idBusca) {
            lista = lista.filter(
                (r) =>
                    r.id === Number(idBusca)
            );
        }

        // Busca por período
        if (dataInicio && dataFim) {
            const inicio = new Date(
                dataInicio + "T00:00:00"
            );

            const fim = new Date(
                dataFim + "T23:59:59"
            );

            lista = lista.filter((r) => {
                const dataReserva =
                    new Date(r.dataInicio);

                return (
                    dataReserva >= inicio &&
                    dataReserva <= fim
                );
            });
        }
        setReservas(lista);
    }


    // Função para definir a cor do status da reserva
    function statusColor(status: string) {
        if (status === "aprovada")
            return "text-green-600";

        if (status === "pendente")
            return "text-yellow-600";

        if (status === "recusada")
            return "text-red-600";

        return "text-gray-600";
    }


    // Função para gerar PDF da reserva selecionada
    function gerarPDF() {
        if (!reservaSelecionada)
            return;

        const pdf =
            new jsPDF();

        pdf.setFontSize(18);

        pdf.text(
            "Comprovante de Reserva",
            20,
            30
        );

        pdf.setFontSize(12);

        pdf.text(
            `ID: ${reservaSelecionada.id}`,
            20,
            50
        );

        pdf.text(
            `Espaco: ${reservaSelecionada.espaco.nome}`,
            20,
            65
        );

        pdf.text(
            `Data inicio: ${new Date(reservaSelecionada.dataInicio).toLocaleString("pt-BR")}`,
            20,
            80
        );

        pdf.text(
            `Data fim: ${new Date(reservaSelecionada.dataFim).toLocaleString("pt-BR")}`,
            20,
            95
        );

        pdf.text(
            `Status: ${reservaSelecionada.status}`,
            20,
            110
        );

        pdf.text(
            `Motivo: ${reservaSelecionada.motivo || "-"}`,
            20,
            125
        );

        pdf.save(
            `reserva-${reservaSelecionada.id}.pdf`
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <div className="flex justify-between mb-8">

                <h1 className="text-3xl font-bold">
                    Minhas Reservas
                </h1>

                <button onClick={() => navigate("/dashboard")} className="bg-slate-700 text-white px-5 py-3 rounded-xl flex gap-2">
                    <ArrowLeft />
                    Voltar
                </button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow mb-8">
                <h2 className="font-bold text-xl mb-4">
                    Buscar reservas
                </h2>

                <div className="grid md:grid-cols-3 gap-4">
                    <input
                        placeholder="ID da reserva"
                        value={idBusca}
                        onChange={
                            e => setIdBusca(e.target.value)
                        }
                        className="border p-3 rounded-xl"
                    />

                    <input
                        type="date"
                        value={dataInicio}
                        onChange={
                            e => setDataInicio(e.target.value)
                        }
                        className="border p-3 rounded-xl"
                    />

                    <input
                        type="date"
                        value={dataFim}
                        onChange={
                            e => setDataFim(e.target.value)
                        }
                        className="border p-3 rounded-xl"
                    />
                </div>

                <button onClick={buscar} className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-xl">
                    Buscar
                </button>

            </div>

            <div className="bg-white rounded-2xl shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-200">
                        <tr>
                            <th className="p-4 text-left">
                                Espaço
                            </th>

                            <th className="p-4 text-left">
                                Data
                            </th>

                            <th className="p-4 text-left">
                                Status
                            </th>

                            <th>
                                Ação
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            reservas.map(r => (
                                <tr
                                    key={r.id}
                                    className="border-t hover:bg-slate-100"
                                >

                                    <td className="p-4">
                                        {r.espaco.nome}
                                    </td>

                                    <td className="p-4">
                                        {
                                            new Date(r.dataInicio)
                                                .toLocaleString("pt-BR")
                                        }
                                    </td>

                                    <td className={`p-4 font-bold ${statusColor(r.status)}`}>
                                        {r.status}
                                    </td>

                                    <td className="p-4">
                                        <button
                                            onClick={() => setReservaSelecionada(r)}
                                            className="bg-blue-600 text-white p-2 rounded-lg"
                                        >
                                            <Eye size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }

                    </tbody>

                </table>
            </div>

            {
                reservaSelecionada && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                        <div className="bg-white rounded-3xl p-8 w-full max-w-lg">
                            <div className="flex justify-between">
                                <h2 className="text-2xl font-bold">
                                    Detalhes
                                </h2>

                                <button
                                    onClick={() =>
                                        setReservaSelecionada(null)
                                    }
                                >
                                    <X />
                                </button>
                            </div>

                            <div className="mt-6 space-y-3">
                                <p>
                                    <strong>ID:</strong> {reservaSelecionada.id}
                                </p>

                                <p>
                                    <strong>Espaço:</strong> {reservaSelecionada.espaco.nome}
                                </p>

                                <p>
                                    <strong>Status:</strong> {reservaSelecionada.status}
                                </p>

                                <p>
                                    <strong>Motivo:</strong> {reservaSelecionada.motivo || "-"}
                                </p>

                                <p>
                                    <strong>Inicio:</strong>
                                    {
                                        new Date(reservaSelecionada.dataInicio)
                                            .toLocaleString("pt-BR")
                                    }
                                </p>

                                <p>
                                    <strong>Fim:</strong>
                                    {
                                        new Date(reservaSelecionada.dataFim)
                                            .toLocaleString("pt-BR")
                                    }
                                </p>
                            </div>

                            <button
                                onClick={gerarPDF}
                                className="mt-8 bg-green-600 text-white px-6 py-3 rounded-xl flex gap-2"

                            >
                                <FileDown />
                                Baixar PDF
                            </button>
                        </div>
                    </div>
                )
            }
        </div>
    );
}