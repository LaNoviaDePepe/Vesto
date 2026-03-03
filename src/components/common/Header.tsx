import { useAuthStore } from "../../stores/authStore";
import GuestHeader from "./GuestHeader";
import UserHeader from "./UserHeader";

/**
 * Componente principal del encabezado (Header Wrapper).
 * Actúa como un controlador o enrutador visual que evalúa el estado global 
 * de la aplicación para decidir qué versión del encabezado renderizar.
 */
export default function Header() {

    // =========================================================================
    // Conexión con el estado global usando Zustand.
    // Se utiliza un selector `(state) => state.isAuthenticated` para extraer únicamente
    // el valor booleano de autenticación. Esta es una excelente práctica porque evita
    // renderizados innecesarios del componente si cambian otras propiedades del store.
    // =========================================================================
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return (
        <>
            {isAuthenticated ? <UserHeader /> : <GuestHeader />}
        </>
    );
}