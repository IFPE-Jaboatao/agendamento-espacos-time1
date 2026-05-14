import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type { JSX } from "react";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro"; // 1. Importe o componente Cadastro
import { useAuth } from "./context/AuthContext";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { usuario, carregando } = useAuth();
  if (carregando) return <div>Carregando...</div>;
  return usuario ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* 2. Adicione a rota de cadastro aqui */}
        <Route path="/cadastro" element={<Cadastro />} />

        <Route path="/dashboard" element={
          <PrivateRoute>
            <div className="p-4">Dashboard (privado)</div>
          </PrivateRoute>
        } />

        {/* Opcional: Rota para capturar caminhos inexistentes (404) */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}