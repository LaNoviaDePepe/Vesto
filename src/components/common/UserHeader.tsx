import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Button from './Button';
import { createUserRepository } from '../../database/repositories';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

/**
 * Propiedades esperadas para el componente UserHeader.
 *
 * @interface UserHeaderProps
 * @property {React.ReactNode} [children] - Elementos adicionales opcionales a renderizar
 * dentro de la barra de acciones (por ejemplo, botones exclusivos de administrador).
 */
interface UserHeaderProps {
    children?: React.ReactNode; 
}

/**
 * Componente que renderiza la cabecera principal para usuarios autenticados.
 * Proporciona acceso a las herramientas del usuario, avatar de perfil, menú responsive
 * y lógica de cierre de sesión. Permite inyectar contenido adicional mediante 'children'.
 *
 * @param {UserHeaderProps} props - Propiedades del componente.
 * @returns {JSX.Element} La estructura de la cabecera privada.
 */
export default function UserHeader({ children }: UserHeaderProps) {
    /**
     * Estado que controla la visibilidad del menú desplegable en dispositivos móviles.
     */
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Extracción de datos y funciones del gestor de estado global (Zustand)
    const sessionUser = useAuthStore((state) => state.sessionUser);
    const clearSession = useAuthStore((state) => state.clearSession);

    /**
     * Lista de enlaces privados correspondientes a las herramientas de la aplicación.
     * @type {Array<{label: string, path: string}>}
     */
    const userLinks = [
        { label: 'Mi armario', path: '/closet' },
        { label: 'Mis conjuntos', path: '/outfits' },
        { label: 'Subir prenda', path: '/clothing' },
        { label: 'Crear conjunto', path: '/outfitCreator' },
    ];


    const userRepository = createUserRepository();
    const navigate = useNavigate();

    /**
     * Gestiona el proceso asíncrono de cierre de sesión.
     * Invoca la base de datos para invalidar la sesión actual, limpia el estado global
     * y redirige al usuario a la página de inicio. Maneja notificaciones en caso de error.
     *
     * @async
     * @returns {Promise<void>} Una promesa que se resuelve al terminar la secuencia de logout.
     */
    const handleLogout = async () => {

        try {
            const result = await userRepository.logout();
            if (result.error) {
                toast.error('Error al cerrar sesión');

                return;
            }
            // Limpiamos sesión usando la función del store y redirigimos a otra página
            clearSession();
            navigate('/');

        } catch (error) {
            toast.error('Ocurrió un error inesperado');
            console.log(error);
        }
    }

    /**
     * URL de la imagen de perfil a mostrar. Usa un avatar por defecto si el usuario no tiene uno definido.
     * @type {string}
     */
    const avatarImg = sessionUser?.profile?.url_avatar ? sessionUser.profile.url_avatar : "/img/Default-Profile-Picture.jfif";

    return (
        <header className="bg-primary-700 header-container">

            <div className="logo">
                <Link to="/">
                    <img src="/img/white-logo.png" alt="Logo de Vesto" className="h-15 w-auto" />
                </Link>
            </div>

            {/* Botón de menú hamburguesa (solo visible en móvil) */}
            <button 
                className="hamburger-btn text-white" 
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
            <div className={`nav-menu bg-primary-700 ${isMenuOpen ? 'is-open' : ''}`}>
                <div onClick={() => setIsMenuOpen(false)}>
                    <Navbar links={userLinks} isUser />
                </div>

                <div className="nav-actions">
                    {/* Aquí es donde inyectamos los "dos botones" del admin.
                        Aparecerán a la izquierda de la foto de perfil.
                    */}
                    {children}
                    <Link to="/profile" className="block h-15 w-15" title="Perfil de usuario">
                        {/* Usamos la variable avatarImg en el src */}
                        <img
                            src={avatarImg}
                            alt="Perfil de usuario"
                            className="h-full w-full object-cover shadow-sm rounded-full"
                        />
                    </Link>

                    <Button variant='icon' onClick={handleLogout} className='min-w-0' title="Cerrar sesión">
                        <LogOut size={20} strokeWidth={2.5} />
                    </Button>
                </div>
            </div>
        </header>
    );
}