import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";


function PublicRoute() {
	// Obtenemos el valor de isAuthenticated 
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAdmin = useAuthStore((state) => state.isAdmin);


  if (isAuthenticated) {
    if(isAdmin) {
      // Si está autenticado y es admin, redirige al panel de control
      return <Navigate to="/admin/dashboard" replace />;
    }
    // Si está autenticado, redirige al armario
    return <Navigate to="/closet" replace />;
  }

  // Si no está autenticado, renderiza el contenido público
  return <Outlet />;
}

export default PublicRoute;