import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import api from "../../services/api";

interface Espaco {
  id: number;
  nome: string;
  capacidade: number;
  tipo: string;
  descricao?: string;
  status: string;
}

export default function Espacos() {

  const navigate = useNavigate();
  const [espacos, setEspacos] = useState<Espaco[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [editando, setEditando] = useState<number | null>(null);

  const [form, setForm] = useState({
    nome: "",
    tipo: "",
    descricao: "",
    capacidade: 0,
    status: "ativo"
  });

  // Carregar espaços
  async function carregarEspacos() {
    try {
      setLoading(true);

      const response = await api.get("/espacos");

      setEspacos(response.data);

    } catch {
      setErro("Erro ao carregar espaços");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarEspacos();
  }, []);


  // Salvar e Atualizar Espaco
  async function salvarEspaco() {
    setErro("");
    setSucesso("");

    if (!form.nome) {
      setErro("Nome do espaço é obrigatório");
      return;
    }

    if (!form.tipo) {
      setErro("Selecione o tipo do espaço");
      return;
    }

    if (form.capacidade <= 0) {
      setErro("Capacidade inválida");
      return;
    }

    try {
      if (editando) {
        await api.put(
          `/espacos/${editando}`,
          form
        );
        setSucesso("Espaço atualizado com sucesso");
      } else {
        await api.post(
          "/espacos",
          form
        );
        setSucesso("Espaço criado com sucesso");
      }
      setForm({
        nome: "",
        tipo: "",
        descricao: "",
        capacidade: 0,
        status: "ativo"
      });
      setEditando(null);
      carregarEspacos();
    } catch (error: any) {
      setErro(
        error.response?.data?.message ||
        "Erro ao salvar espaço"
      );

    }
  }


  // Editar Espaco
  function editarEspaco(espaco: Espaco) {
    setEditando(espaco.id);
    setForm({
      nome: espaco.nome,
      tipo: espaco.tipo,
      descricao: espaco.descricao || "",
      capacidade: espaco.capacidade,
      status: espaco.status
    });

  }


  // Excluir Espaco
  async function excluirEspaco(id: number) {
    setErro("");
    setSucesso("");
    if (!confirm("Excluir este espaço?"))
      return;
    try {
      await api.delete(`/espacos/${id}`);
      setSucesso("Espaço removido");
      carregarEspacos();
    } catch (error: any) {
      setErro(
        error.response?.data?.message ||
        "Erro ao excluir espaço"
      );
    }
  }


  // Render
  return (

    <div className="p-8 bg-slate-100 min-h-screen">
      <div className="flex justify-between mb-6">

        <h1 className="text-3xl font-bold">
          Gerenciar Espaços
        </h1>

        <button
          onClick={() => navigate("/admin")}
          className=" bg-slate-700 text-white px-5 py-3 rounded-xl flex gap-2"
        >
          <ArrowLeft size={20} />
          Voltar

        </button>

      </div>

      {erro && (
        <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-4">
          ❌ {erro}
        </div>
      )}

      {sucesso && (
        <div className="bg-green-100 text-green-700 p-4 rounded-xl mb-4">
          ✅ {sucesso}
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow mb-8">

        <h2 className="text-xl font-bold mb-4">
          {editando ? "Editar espaço" : "Cadastrar espaço"}
        </h2>

        <div className="grid md:grid-cols-5 gap-3">

          <input
            className="border rounded-xl p-3"
            placeholder="Nome"
            value={form.nome}
            onChange={e => setForm({ ...form, nome: e.target.value })}
          />

          <select
            className="border rounded-xl p-3"
            value={form.tipo}
            onChange={e => setForm({ ...form, tipo: e.target.value })}
          >

            <option value="">Tipo</option>
            <option value="sala">Sala</option>
            <option value="laboratorio">Laboratório</option>
            <option value="auditorio">Auditório</option>

          </select>

          <input
            className="border rounded-xl p-3"
            placeholder="Descrição"
            value={form.descricao}
            onChange={e => setForm({ ...form, descricao: e.target.value })}
          />

          <input
            type="number"
            className="border rounded-xl p-3"
            placeholder="Capacidade"
            value={form.capacidade}
            onChange={e => setForm({ ...form, capacidade: Number(e.target.value) })}
          />

          <select
            className="border rounded-xl p-3"
            value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value })}
          >

            <option value="ativo">
              Ativo
            </option>

            <option value="inativo">
              Inativo
            </option>

          </select>
        </div>

        <button
          onClick={salvarEspaco}
          className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-xl flex gap-2"
        >

          <Plus size={18} />

          {editando ? "Atualizar" : "Cadastrar"}

        </button>

      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Nome</th>
              <th className="p-4 text-left">Tipo</th>
              <th className="p-4 text-left">Descrição</th>
              <th className="p-4 text-left">Capacidade</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4">Ações</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td colSpan={6} className="p-5 text-center">
                  Carregando...
                </td>
              </tr>

            ) : espacos.map((espaco) => (

              <tr key={espaco.id} className="border-t">
                <td className="p-4">
                  {espaco.nome}
                </td>
                <td className="p-4">
                  {espaco.tipo}
                </td>
                <td className="p-4">
                  {espaco.descricao || "-"}
                </td>
                <td className="p-4">
                  {espaco.capacidade}
                </td>
                <td className="p-4">
                  {espaco.status}
                </td>
                <td className="p-4">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => editarEspaco(espaco)}
                      className="bg-yellow-500 text-white p-2 rounded"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => excluirEspaco(espaco.id)}
                      className="bg-red-500 text-white p-2 rounded"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>
        </table>
      </div>
    </div>
  );
}