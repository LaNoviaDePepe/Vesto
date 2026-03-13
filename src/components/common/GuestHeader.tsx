import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Button from './Button';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from "react-i18next";

/**
 * Componente `GuestHeader`.
 * * Cabecera de navegación para usuarios no autenticados.
 * El logo se invierte dinámicamente (`dark:invert`) para verse blanco sobre fondos oscuros.
 * * @returns {JSX.Element} La estructura de la cabecera para visitantes.
 */
export default function GuestHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { t } = useTranslation();

    const handleScrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) { element.scrollIntoView({ behavior: 'smooth' }); }
        setIsMenuOpen(false);
    };

    const guestLinks = [
        { label: t('navbar.links.home'), path: '/#hero' },
        { label: t('navbar.links.behaviour'), path: '/#funcionamiento' },
        { label: t('navbar.links.reviews'), path: '/#reviews' },
        { label: t('navbar.links.team'), path: '/#equipo' }
    ];

    return (
        <header className="bg-auxiliary-700 dark:bg-gray-950 header-container transition-colors duration-500">
            <div className="logo hidden lg:block">
                <Link to="/#hero" onClick={() => handleScrollToSection('hero')}>
                    <img src="/img/black-logo.png" alt="Logo de Vesto" className="h-15 w-auto dark:invert transition-all duration-300" />
                </Link>
            </div>

            <button className="hamburger-btn md:hidden text-black dark:text-white transition-colors duration-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            <div className={`nav-menu bg-auxiliary-700 dark:bg-gray-950 ${isMenuOpen ? 'is-open' : ''} transition-colors duration-500`}>
                <button className="absolute top-4 left-4 text-black dark:text-white p-2 hover:bg-gray-200 dark:hover:bg-gray-800 md:hidden transition-colors duration-300" onClick={() => setIsMenuOpen(false)}>
                    <X size={24} />
                </button>
                <Navbar links={guestLinks} onLinkClick={handleScrollToSection} />

                <div className="nav-actions">
                    <Link to="/login" className="nav-btn-mobile" onClick={() => setIsMenuOpen(false)}>
                        <Button variant='primary' className="w-full">{t('navbar.button.login')}</Button>
                    </Link>
                    <Link to="/signup" className="nav-btn-mobile" onClick={() => setIsMenuOpen(false)}>
                        <Button variant='auxiliar' className="w-full">{t('navbar.button.signup')}</Button>
                    </Link>
                </div>
                <LanguageSwitcher />
            </div>
        </header>
    );
}