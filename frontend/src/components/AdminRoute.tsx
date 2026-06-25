import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return <div>Carregando...</div>;
  }

  if (!usuario) {
    return <Navigate to="/" />;
  }

  if (usuario.perfil !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
}