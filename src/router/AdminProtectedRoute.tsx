import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

function AdminProtectedRoute() {
    	// Obtenemos el valor de isAuthenticated y de isAdmin
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isAdmin = useAuthStore((state) => state.isAdmin);

  if (!isAuthenticated) {
    // Si no está autenticado, redirige al login
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    // Si no es administrador, redirige al armario
    return <Navigate to="/closet" replace />; 
  }
  // Si está autenticado y es admin, renderiza el contenido protegido
  return <Outlet />;
}

export default AdminProtectedRoute;