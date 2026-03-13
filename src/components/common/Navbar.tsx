import { Link } from 'react-router-dom';

interface NavLinkItem { label: string; path: string; }
interface NavbarProps { links: NavLinkItem[], isUser?: boolean, onLinkClick?: (id: string) => void }

export default function Navbar({ links, isUser = false, onLinkClick }: NavbarProps) {
    return (
        <nav className={`p-4 nav-links-container ${!isUser ? 'nav-links-guest-grid' : ''}`}>
            {links.map((link) => {
                const sectionId = link.path.split('#')[1];
                return (
                    <Link
                        key={link.path} to={link.path} onClick={() => onLinkClick && sectionId && onLinkClick(sectionId)}
                        className={`font-medium transition-colors duration-300 ${
                            isUser 
                            ? 'text-white hover:text-auxiliary-100 dark:hover:text-primary-400 hover:font-semibold' 
                            : 'text-black dark:text-white hover:text-primary-500 dark:hover:text-primary-400'
                        }`}
                    >
                        {link.label}
                    </Link>
                );
            })}
        </nav>
    );
}