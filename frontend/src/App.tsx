import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type { JSX } from "react";

import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";

import AdminDashboard from "./pages/admin/AdminDashboard";
import Espacos from "./pages/admin/Espacos";

import AdminRoute from "./components/AdminRoute";

import Usuarios from "./pages/admin/Usuarios";

import { useAuth } from "./context/AuthContext";

function PrivateRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return <div>Carregando...</div>;
  }

  return usuario ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route
          path="/"
          element={<Login />}
        />

        {/* CADASTRO */}
        <Route
          path="/cadastro"
          element={<Cadastro />}
        />

        {/* DASHBOARD USUÁRIO */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <div className="p-6">
                Dashboard Usuário
              </div>
            </PrivateRoute>
          }
        />

        {/* DASHBOARD ADMIN */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* ESPAÇOS */}
        <Route
          path="/admin/espacos"
          element={
            <AdminRoute>
              <Espacos />
            </AdminRoute>
          }
        />

        {/* USUÁRIOS */}
        <Route
          path="/admin/usuarios"
          element={
            <AdminRoute>
              <Usuarios />
            </AdminRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={<Navigate to="/" />}
        />

      </Routes>
    </BrowserRouter>
  );
}