import { AppRoutes } from "@/src/constants/app-routes";
import { useAuth } from "@/src/contexts/AuthContex";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <></>;
  }

  if (!user) {
    return <Navigate to={AppRoutes.LOGIN} replace />;
  }

  return <Outlet />;
}
