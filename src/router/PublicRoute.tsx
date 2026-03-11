import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

function PublicRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAdmin = useAuthStore((state) => state.isAdmin);

  if (isAuthenticated) {
    if(isAdmin) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/closet" replace />;
  }
  return <Outlet />;
}

export default PublicRoute;