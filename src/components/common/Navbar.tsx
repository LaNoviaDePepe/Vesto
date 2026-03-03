import { Link } from 'react-router-dom';

/**
 * Estructura de datos para cada elemento de navegación.
 * Define la forma que debe tener cada objeto dentro del array de links.
 */
interface NavLinkItem {
    label: string;
    path: string;
}

/**
 * Propiedades esperadas por el componente Navbar.
 */
interface NavbarProps {
    links: NavLinkItem[],
    isUser?: boolean //Determina si la navbar corresponde al usuario o no, para controlar el color del texto
}

/**
 * Componente funcional de interfaz (UI) que renderiza una barra de navegación.
 * Es reutilizable y dinámico: se adapta tanto a los menús de usuarios registrados 
 * como a los menús públicos dependiendo de las props que reciba.
 */
export default function Navbar({ links, isUser = false }: NavbarProps) {

    return (
        <nav className="flex items-center gap-6 p-4">
            {
                links.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`font-medium ${
                        isUser ? 'text-white hover:text-black hover:font-semibold' : 'text-black hover:text-white'}`}
                    >
                        {link.label}
                    </Link>
                ))}
        </nav>
    );
}