import { useAuthStore } from "../../stores/authStore";
import AdminHeader from "./AdminHeader";
import GuestHeader from "./GuestHeader";
import UserHeader from "./UserHeader";



export default function Header() {

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isAdmin = useAuthStore((state) => state.isAdmin);
    return (
        <>
            {!isAuthenticated ? (
                // Si no está autenticado, muestra el header de invitado
                <GuestHeader />
            ) : isAdmin ? (
                // Si está autenticado y es admin, muestra el header de administrador
                <AdminHeader />
            ) : (
                // Si está autenticado pero no es admin, muestra el header de usuario
                <UserHeader />
            )}
        </>
    );
}
