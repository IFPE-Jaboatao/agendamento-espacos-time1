import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

import api from "../services/api";

/**
 * Usuário autenticado
 */
interface Usuario {
  id: number;
  nome: string;
  login: string;
  email: string;
  perfil: "admin" | "usuario";
  tipoUsuario?: "aluno" | "professor" | "coordenador";
}

/**
 * Tipagem do contexto
 */
interface AuthContextType {
  usuario: Usuario | null;

  login: (
    login: string,
    senha: string
  ) => Promise<void>;

  register: (
    dados: any
  ) => Promise<void>;

  logout: () => void;

  carregando: boolean;
}

const AuthContext =
  createContext<AuthContextType>(
    {} as AuthContextType
  );

/**
 * Provider de autenticação
 */
export function AuthProvider({
  children
}: {
  children: ReactNode
}) {

  const [usuario, setUsuario] =
    useState<Usuario | null>(null);

  const [carregando, setCarregando] =
    useState(true);

  /**
   * Carrega usuário salvo
   */
  useEffect(() => {

    const token =
      localStorage.getItem("token");

    const usuarioSalvo =
      localStorage.getItem("usuario");

    if (token && usuarioSalvo) {

      try {

        setUsuario(
          JSON.parse(usuarioSalvo)
        );

        /**
         * Define token padrão
         */
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;

      } catch (e) {

        console.error(
          "Erro ao carregar usuário",
          e
        );

      }
    }

    setCarregando(false);

  }, []);

  /**
   * LOGIN
   */
  async function login(
    login: string,
    senha: string
  ) {

    const response =
      await api.post(
        "/auth/login",
        {
          login,
          senha
        }
      );

    const {
      token,
      usuario
    } = response.data;

    /**
     * Salva token
     */
    localStorage.setItem(
      "token",
      token
    );

    /**
     * Salva usuário
     */
    localStorage.setItem(
      "usuario",
      JSON.stringify(usuario)
    );

    /**
     * Define token no axios
     */
    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;

    setUsuario(usuario);
  }

  /**
   * CADASTRO
   */
  async function register(
    dados: any
  ) {

    await api.post(
      "/auth/register",
      dados
    );

  }

  /**
   * LOGOUT
   */
  function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("usuario");

    delete api.defaults.headers.common[
      "Authorization"
    ];

    setUsuario(null);
  }

  return (

    <AuthContext.Provider
      value={{
        usuario,
        login,
        register,
        logout,
        carregando
      }}
    >

      {children}

    </AuthContext.Provider>

  );
}

/**
 * Hook do contexto
 */
export const useAuth = () =>
  useContext(AuthContext);