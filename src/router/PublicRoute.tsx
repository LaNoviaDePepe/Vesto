import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";


function PublicRoute() {
	// Obtenemos el valor de isAuthenticated 
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    // Si está autenticado, redirige al armario
    return <Navigate to="/closet" replace />;
  }

  // Si está autenticado, renderiza el contenido protegido
  return <Outlet />;
}

export default PublicRoute;