import { Link } from 'react-router-dom';

// Estructura de cada enlace
interface NavLinkItem {
    label: string;
    path: string;
}

// El elemento recibe una lista de links de typo NavLinkItem
interface NavbarProps {
    links: NavLinkItem[];
}

export default function Navbar({ links }: NavbarProps) {

    return (
        <nav className="flex items-center gap-4 p-4">
            {
                links.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className=""
                    >
                        {link.label}
                    </Link>
                ))}
        </nav>
    );
}