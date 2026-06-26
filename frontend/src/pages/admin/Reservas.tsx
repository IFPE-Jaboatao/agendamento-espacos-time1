import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, X, Ban } from "lucide-react";
import api from "../../services/api";

interface Reserva {
    id: number;
    dataInicio: string;
    dataFim: string;
    status: string;
    motivo?: string;
    solicitante: {
        nome: string;
    };
    espaco: {
        nome: string;
    };
}

export default function Reservas() {

    const navigate = useNavigate();
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    async function carregarReservas() {


        try {


            const response =
                await api.get("/reservas");


            setReservas(response.data);



        } catch (error) {


            setErro(
                "Erro ao carregar reservas"
            );


        }


    }





    useEffect(() => {


        carregarReservas();


    }, []);







    async function alterarStatus(
        id: number,
        acao: string
    ) {


        setErro("");
        setSucesso("");



        try {


            await api.patch(

                `/reservas/${id}/${acao}`

            );



            if (acao === "aprovar") {

                setSucesso(
                    "Reserva aprovada"
                );

            }


            if (acao === "recusar") {

                setSucesso(
                    "Reserva recusada"
                );

            }


            if (acao === "cancelar") {

                setSucesso(
                    "Reserva cancelada"
                );

            }



            carregarReservas();



        } catch (error: any) {



            setErro(

                error.response?.data?.message ||

                "Erro ao alterar reserva"

            );


        }



    }








    function formatarData(
        data: string
    ) {


        return new Date(data)
            .toLocaleString(
                "pt-BR"
            );


    }








    return (


        <div className="p-8 bg-slate-100 min-h-screen">



            <div className="flex justify-between items-center mb-6">


                <h1 className="text-3xl font-bold">

                    Gerenciamento de Reservas

                </h1>




                <button

                    onClick={() => navigate("/admin")}

                    className="
flex
items-center
gap-2
bg-slate-700
text-white
px-5
py-3
rounded-xl
"

                >


                    <ArrowLeft size={20} />

                    Voltar


                </button>



            </div>








            {erro && (

                <div className="
bg-red-100
text-red-700
p-4
rounded-xl
mb-4
">

                    ❌ {erro}

                </div>

            )}






            {sucesso && (

                <div className="
bg-green-100
text-green-700
p-4
rounded-xl
mb-4
">

                    ✅ {sucesso}

                </div>

            )}









            <div className="
bg-white
rounded-2xl
shadow
overflow-hidden
">


                <table className="w-full">



                    <thead className="bg-slate-100">


                        <tr>


                            <th className="p-4 text-left">
                                Usuário
                            </th>


                            <th className="p-4 text-left">
                                Espaço
                            </th>


                            <th className="p-4 text-left">
                                Início
                            </th>


                            <th className="p-4 text-left">
                                Fim
                            </th>


                            <th className="p-4 text-left">
                                Status
                            </th>


                            <th className="p-4 text-left">
                                Motivo
                            </th>


                            <th className="p-4">
                                Ações
                            </th>


                        </tr>


                    </thead>







                    <tbody>



                        {
                            reservas.length === 0 ? (


                                <tr>

                                    <td
                                        colSpan={7}
                                        className="p-6 text-center"
                                    >

                                        Nenhuma reserva encontrada

                                    </td>

                                </tr>



                            ) :

                                reservas.map(reserva => (


                                    <tr
                                        key={reserva.id}
                                        className="border-t"
                                    >


                                        <td className="p-4">

                                            {reserva.solicitante?.nome}

                                        </td>




                                        <td className="p-4">

                                            {reserva.espaco?.nome}

                                        </td>




                                        <td className="p-4">

                                            {formatarData(
                                                reserva.dataInicio
                                            )}

                                        </td>




                                        <td className="p-4">

                                            {formatarData(
                                                reserva.dataFim
                                            )}

                                        </td>





                                        <td className="p-4">

                                            {reserva.status}

                                        </td>




                                        <td className="p-4">

                                            {reserva.motivo || "-"}

                                        </td>





                                        <td className="p-4">


                                            <div className="flex gap-2 justify-center">





                                                <button

                                                    onClick={() =>
                                                        alterarStatus(
                                                            reserva.id,
                                                            "aprovar"
                                                        )
                                                    }

                                                    className="
bg-green-600
text-white
p-2
rounded
"

                                                >

                                                    <Check size={18} />

                                                </button>







                                                <button

                                                    onClick={() =>
                                                        alterarStatus(
                                                            reserva.id,
                                                            "recusar"
                                                        )
                                                    }

                                                    className="
bg-red-600
text-white
p-2
rounded
"

                                                >

                                                    <X size={18} />

                                                </button>








                                                <button

                                                    onClick={() =>
                                                        alterarStatus(
                                                            reserva.id,
                                                            "cancelar"
                                                        )
                                                    }

                                                    className="
bg-gray-600
text-white
p-2
rounded
"

                                                >


                                                    <Ban size={18} />


                                                </button>





                                            </div>


                                        </td>




                                    </tr>


                                ))


                        }



                    </tbody>



                </table>



            </div>




        </div>


    );
}