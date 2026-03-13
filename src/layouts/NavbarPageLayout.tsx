import Header from "../components/common/Header";
import { Outlet } from "react-router-dom";

/**
 * Componente `NavbarPageLayout`.
 * * Envuelve las páginas estándar proporcionando una cabecera de navegación (`Header`)
 * y un contenedor principal `main` que se adapta dinámicamente al modo oscuro 
 * eliminando el fondo beige claro por defecto.
 * * @returns {JSX.Element} Layout de página con Navbar.
 */
export default function NavbarPageLayout() {
    return (
        <div className="min-h-screen flex flex-col transition-colors duration-300">
            <Header />
            {/* El fondo pasa de beige claro a gris oscuro en modo oscuro */}
            <main className="flex-1 bg-auxiliary-50 dark:bg-gray-950 pt-12 transition-colors duration-300">
                <Outlet />
            </main>
        </div>
    );
}