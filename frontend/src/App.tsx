import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type { JSX } from "react";
import Login from "./pages/Login";
import { useAuth } from "./context/AuthContext";

// Componente para rotas privadas
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
        <Route path="/dashboard" element={
          <PrivateRoute>
            <div className="p-4">Dashboard (privado)</div>
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}