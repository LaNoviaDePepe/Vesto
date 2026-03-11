import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Button from './Button';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

/**
 * Componente que renderiza la cabecera de navegación para usuarios no autenticados (invitados).
 * Incluye un menú responsive tipo hamburguesa para pantallas menores a 720px y
 * enlaces ancla para navegación suave (smooth scroll) dentro de la Landing Page.
 *
 * @returns {JSX.Element} La estructura de la cabecera para visitantes.
 */
export default function GuestHeader() {
    /**
     * Estado que controla la visibilidad del menú desplegable en dispositivos móviles.
     * @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]}
     */
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    /**
     * Maneja el desplazamiento suave hacia una sección específica de la página.
     * Una vez activado el scroll, cierra el menú móvil de forma automática.
     *
     * @param {string} id - El identificador (ID) del elemento HTML destino (ej. 'hero', 'equipo').
     */
    const handleScrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMenuOpen(false);
    };

    /**
     * Lista de enlaces de navegación pública para la vista de invitado.
     * @type {Array<{label: string, path: string}>}
     */
    const guestLinks = [
        { label: 'Inicio', path: '/#hero' },
        { label: 'Funcionamiento', path: '/#funcionamiento' },
        { label: 'Reviews', path: '/#reviews' },
        { label: 'Equipo', path: '/#equipo' },
    ];

    return (
        <header className="bg-auxiliary-700 header-container">
            <div className="logo">
                <Link to="/#hero" onClick={() => handleScrollToSection('hero')}>
                    <img src="/img/black-logo.png" alt="Logo de Vesto" className="h-15 w-auto" />
                </Link>
            </div>

            {/* Botón de menú hamburguesa (solo visible en móvil) */}
            <button
                className="hamburger-btn text-black"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Alternar menú"
            >
                {/* Renderizado Condicional (Operador Ternario):
                Pregunta: ¿isMenuOpen es true (está abierto)?
                - Si SÍ: Muestra el icono <X /> (para poder cerrarlo).
                - Si NO: Muestra el icono <Menu /> (las 3 rayitas, para poder abrirlo).
                Ambos iconos tendrán un tamaño de 28 píxeles.
                */}
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Contenedor colapsable del menú y acciones */}
            <div className={`nav-menu bg-auxiliary-700 ${isMenuOpen ? 'is-open' : ''}`}>
                <Navbar links={guestLinks} onLinkClick={handleScrollToSection} />

                <div className="nav-actions">
                    <Link to="/login" className="nav-btn-mobile" onClick={() => setIsMenuOpen(false)}>
                        <Button variant='primary' className="w-full">Iniciar sesión</Button>
                    </Link>
                    <Link to="/signup" className="nav-btn-mobile" onClick={() => setIsMenuOpen(false)}>
                        <Button variant='auxiliar' className="w-full">Registro</Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}