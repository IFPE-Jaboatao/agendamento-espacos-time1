import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import api from "../services/api";

// 1. Interface atualizada conforme sua entidade TypeORM
interface Usuario {
  id: number;
  nome: string;
  login: string;
  email: string;
  perfil: "admin" | "usuario";
  tipoUsuario?: "aluno" | "professor" | "coordenador";
}

// 2. Definição das funções que o contexto oferece
interface AuthContextType {
  usuario: Usuario | null;
  login: (login: string, senha: string) => Promise<void>;
  register: (dados: any) => Promise<void>;
  logout: () => void;
  carregando: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  // Carrega usuário do localStorage ao iniciar a aplicação
  useEffect(() => {
    const token = localStorage.getItem("token");
    const usuarioSalvo = localStorage.getItem("usuario");
    
    if (token && usuarioSalvo) {
      try {
        setUsuario(JSON.parse(usuarioSalvo));
        // Configura o token nas requisições futuras do axios
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (e) {
        console.error("Erro ao carregar usuário do storage", e);
      }
    }
    setCarregando(false);
  }, []);

  // Função de Login
  async function login(login: string, senha: string) {
    const response = await api.post("/auth/login", { login, senha });
    const { token, usuario } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(usuario));
    
    // Define o token no cabeçalho do axios
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    
    setUsuario(usuario);
  }

  // Função de Cadastro (Nova)
  async function register(dados: any) {
    // Certifique-se de que a rota no seu backend é /usuarios
    await api.post("/auth/registrar", dados);
  }

  // Função de Logout
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    delete api.defaults.headers.common["Authorization"];
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, login, register, logout, carregando }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar o contexto
export const useAuth = () => useContext(AuthContext);