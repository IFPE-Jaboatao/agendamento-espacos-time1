import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import api from "../../services/api";

interface Usuario {
    id: number;
    nome: string;
    email: string;
    login: string;
    perfil: string;
    tipoUsuario: string;
}

export default function Usuarios() {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [editando, setEditando] = useState<number | null>(null);

    const [form, setForm] = useState({
        nome: "",
        email: "",
        login: "",
        senha: "",
        tipoUsuario: "aluno"
    });


    // Carregar usuários do backend
    async function carregarUsuarios() {
        try {
            const response = await api.get("/usuarios");
            setUsuarios(response.data);
        } catch (error) {
            setErro(
                "Erro ao carregar usuários"
            );
        }
    }
    useEffect(() => {
        carregarUsuarios();
    }, []);


    // Limpar formulário
    function limparFormulario() {
        setForm({
            nome: "",
            email: "",
            login: "",
            senha: "",
            tipoUsuario: "aluno"
        });
        setEditando(null);
    }

    // Salvar usuário
    async function salvarUsuario() {
        setErro("");
        setSucesso("");
        if (
            !form.nome ||
            !form.email ||
            !form.login
        ) {
            setErro(
                "Nome, email e login são obrigatórios"
            );
            return;
        }

        try {
            const dados = {
                ...form
            };

            if (editando) {
                await api.put(
                    `/usuarios/${editando}`, dados
                );

                setSucesso(
                    "Usuário atualizado com sucesso"
                );
            } else {
                await api.post(
                    "/usuarios",
                    dados
                );
                setSucesso(
                    "Usuário cadastrado com sucesso"
                );
            }
            limparFormulario();
            carregarUsuarios();
        } catch (error: any) {
            setErro(
                error.response?.data?.message ||
                "Erro ao salvar usuário"
            );
        }
    }


    // Editar usuário
    function editarUsuario(usuario: Usuario) {
        setEditando(usuario.id);
        setForm({
            nome: usuario.nome,
            email: usuario.email,
            login: usuario.login,
            senha: "",
            tipoUsuario: usuario.tipoUsuario
        });
    }


    // Excluir usuário
    async function excluirUsuario(id: number) {
        const confirmar =
            confirm(
                "Deseja excluir este usuário?"
            );
        if (!confirmar)
            return;
        try {
            await api.delete(
                `/usuarios/${id}`
            );
            setSucesso(
                "Usuário removido com sucesso"
            );
            carregarUsuarios();
        } catch (error: any) {
            setErro(
                error.response?.data?.message ||
                "Erro ao excluir usuário"
            );
        }
    }


    // Renderizar componente 
    return (

        <div className="p-8 bg-slate-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">

                <h1 className="text-3xl font-bold">
                    Gerenciamento de Usuários
                </h1>

                <button
                    onClick={() => navigate("/admin")}
                    className="flex gap-2 items-center bg-slate-700 text-white px-5 py-3 rounded-xl"
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
                <h2 className="text-xl font-bold mb-5">
                    {
                        editando
                            ?
                            "Editar usuário"
                            :
                            "Cadastrar usuário"
                    }
                </h2>

                <div className="grid md:grid-cols-6 gap-3">
                    <input
                        className="border rounded-xl p-3"
                        placeholder="Nome"
                        value={form.nome}
                        onChange={e =>
                            setForm({
                                ...form,
                                nome: e.target.value
                            })
                        }
                    />

                    <input
                        className="border rounded-xl p-3"
                        placeholder="Email"
                        value={form.email}
                        onChange={e =>
                            setForm({
                                ...form,
                                email: e.target.value
                            })
                        }
                    />

                    <input
                        className="border rounded-xl p-3"
                        placeholder="Login"
                        value={form.login}
                        onChange={e =>
                            setForm({
                                ...form,
                                login: e.target.value
                            })
                        }
                    />

                    <input
                        type="password"
                        className="border rounded-xl p-3"
                        placeholder="Senha"
                        value={form.senha}
                        onChange={e =>
                            setForm({
                                ...form,
                                senha: e.target.value
                            })
                        }
                    />

                    <select
                        className="border rounded-xl p-3"
                        value={form.tipoUsuario}
                        onChange={e =>
                            setForm({
                                ...form,
                                tipoUsuario: e.target.value
                            })
                        }
                    >

                        <option value="aluno">
                            Aluno
                        </option>

                        <option value="professor">
                            Professor
                        </option>

                        <option value="coordenador">
                            Coordenador
                        </option>

                    </select>

                </div>

                <button
                    onClick={salvarUsuario}
                    className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-xl flex gap-2"
                >
                    <Plus size={18} />
                    {
                        editando
                            ?
                            "Atualizar"
                            :
                            "Cadastrar"
                    }

                </button>

            </div>

            <div className="bg-white rounded-2xl shadow overflow-hidden">

                <table className="w-full">
                    <thead className="bg-slate-100">
                        <tr>
                            <th className="p-4 text-left">
                                Nome
                            </th>

                            <th className="p-4 text-left">
                                Email
                            </th>

                            <th className="p-4 text-left">
                                Login
                            </th>

                            <th className="p-4 text-left">
                                Tipo
                            </th>

                            <th className="p-4 text-left">
                                Perfil
                            </th>

                            <th className="p-4">
                                Ações
                            </th>

                        </tr>
                    </thead>

                    <tbody>
                        {usuarios.map(usuario => (
                            <tr
                                key={usuario.id}
                                className="border-t"
                            >
                                <td className="p-4">
                                    {usuario.nome}
                                </td>

                                <td className="p-4">
                                    {usuario.email}
                                </td>

                                <td className="p-4">
                                    {usuario.login}
                                </td>

                                <td className="p-4">
                                    {usuario.tipoUsuario}
                                </td>

                                <td className="p-4">
                                    {usuario.perfil}
                                </td>

                                <td className="p-4">

                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => editarUsuario(usuario)}
                                            className="bg-yellow-500 text-white p-2 rounded"
                                        >
                                            <Pencil size={18} />
                                        </button>

                                        <button
                                            onClick={() => excluirUsuario(usuario.id)}
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