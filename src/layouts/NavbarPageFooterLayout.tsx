import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import { Outlet } from "react-router-dom";

/**
 * Componente `NavbarPageFooterLayout`.
 * * Layout utilizado para páginas que requieren tanto cabecera de navegación
 * como pie de página (ej. Login, Registro). 
 * Se ha adaptado para que el fondo del contenido principal cambie a oscuro 
 * cuando el modo oscuro está activo.
 * * @returns {JSX.Element} Layout de página completo con Header y Footer.
 */
export default function NavbarPageFooterLayout() {
    return (
        <div className="min-h-screen flex flex-col transition-colors duration-300">
            <Header />

            <main className="flex-1 bg-auxiliary-50 dark:bg-gray-900 py-25 transition-colors duration-300">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}