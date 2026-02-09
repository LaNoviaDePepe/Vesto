import { Link } from 'react-router-dom';

// Estructura de cada enlace
interface NavLinkItem {
    label: string;
    path: string;
}

// El elemento recibe una lista de links de typo NavLinkItem
interface NavbarProps {
    links: NavLinkItem[],
    isUser?: boolean //Determina si la navbar corresponde al usuario o no, para controlar el color del texto
}

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