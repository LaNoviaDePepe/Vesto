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
    onLinkClick?: (id: string) => void
}

export default function Navbar({ links, isUser = false, onLinkClick }: NavbarProps) {

    return (
        <nav className={`p-4 nav-links-container ${!isUser ? 'nav-links-guest-grid' : ''}`}>
            {
                links.map((link) => {
                    const sectionId = link.path.split('#')[1];

                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => onLinkClick && sectionId && onLinkClick(sectionId)}
                            className={`font-medium ${isUser ? 'text-white hover:text-black hover:font-semibold' : 'text-black hover:text-white'}`}
                        >
                            {link.label}
                        </Link>
                    );
                })
            }
        </nav>
    );
}