import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import api from "../../services/api";


interface LogReserva {

id:number;

status:string;

log:string[];

dataCriacao:string;

}



export default function HistoricoReservas(){


const navigate = useNavigate();



const [idReserva,setIdReserva] =
useState("");



const [inicio,setInicio] =
useState("");



const [fim,setFim] =
useState("");



const [historico,setHistorico] =
useState<any[]>([]);



const [erro,setErro] =
useState("");



const [sucesso,setSucesso] =
useState("");







async function buscarPorId(){


setErro("");
setSucesso("");



if(!idReserva){

setErro(
"Informe o ID da reserva"
);

return;

}



try{


const response = await api.get(

`/reservas/${idReserva}/log`

);



setHistorico(
response.data
);



setSucesso(
"Histórico carregado"
);



}catch(error:any){


setErro(

error.response?.data?.message ||

"Reserva não encontrada"

);



}



}







async function buscarPeriodo(){



setErro("");
setSucesso("");



if(!inicio || !fim){


setErro(
"Informe a data inicial e final"
);


return;

}





try{


const response = await api.get(

"/reservas/historico/periodo",

{

params:{

inicio,
fim

}

}

);



setHistorico(
response.data
);



setSucesso(
"Histórico por período carregado"
);



}catch(error:any){


setErro(

error.response?.data?.message ||

"Erro ao buscar histórico"

);


}



}






function formatarData(data:string){


return new Date(data)
.toLocaleString(
"pt-BR"
);


}







return(


<div className="p-8 bg-slate-100 min-h-screen">



<div className="flex justify-between items-center mb-6">


<h1 className="text-3xl font-bold">

Histórico de Reservas

</h1>



<button

onClick={()=>navigate("/admin")}

className="
bg-slate-700
text-white
px-5
py-3
rounded-xl
flex
gap-2
items-center
"

>


<ArrowLeft size={20}/>

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
grid
md:grid-cols-2
gap-6
mb-8
">






<div className="
bg-white
p-6
rounded-2xl
shadow
">


<h2 className="font-bold text-xl mb-4">

Buscar por ID

</h2>


<div className="flex gap-3">


<input

className="
border
rounded-xl
p-3
flex-1
"

type="number"

placeholder="ID da reserva"

value={idReserva}

onChange={e=>

setIdReserva(
e.target.value
)

}

/>



<button

onClick={buscarPorId}

className="
bg-blue-600
text-white
px-5
rounded-xl
"

>


<Search size={20}/>


</button>



</div>



</div>









<div className="
bg-white
p-6
rounded-2xl
shadow
">


<h2 className="font-bold text-xl mb-4">

Buscar por período

</h2>




<div className="flex gap-3">



<input

type="date"

className="
border
rounded-xl
p-3
"

value={inicio}

onChange={e=>

setInicio(
e.target.value
)

}

/>




<input

type="date"

className="
border
rounded-xl
p-3
"

value={fim}

onChange={e=>

setFim(
e.target.value
)

}

/>





<button

onClick={buscarPeriodo}

className="
bg-blue-600
text-white
px-5
rounded-xl
"

>


<Search size={20}/>


</button>



</div>




</div>



</div>









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
ID
</th>


<th className="p-4 text-left">
Status
</th>


<th className="p-4 text-left">
Data
</th>


<th className="p-4 text-left">
Histórico
</th>


</tr>


</thead>







<tbody>



{
historico.length === 0 ? (


<tr>

<td

colSpan={4}

className="p-6 text-center"

>

Nenhum histórico encontrado

</td>


</tr>



):

historico.map((item:any,index)=>(


<tr
key={index}
className="border-t"
>


<td className="p-4">

{item.id}

</td>


<td className="p-4">

{item.status || "-"}

</td>


<td className="p-4">

{item.dataCriacao
?
formatarData(item.dataCriacao)
:
"-"
}

</td>



<td className="p-4">


{

Array.isArray(item.log)

?

item.log.map(
((texto:string,i:number)=>(

<p key={i}>

• {texto}

</p>

))

)

:

item.log

}



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