import { AppRoutes } from "@/src/constants/app-routes";
import { useAuth } from "@/src/contexts/AuthContex";
import { Navigate, Outlet } from "react-router-dom";

export function PublicRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (user) {
    return <Navigate to={AppRoutes.DASHBOARD} replace />;
  }

  return <Outlet />;
}
