import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Button from './Button';
import ThemeToggle from './ThemeToggle';
import { createUserRepository } from '../../database/repositories';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';
import { LogOut } from 'lucide-react';

export default function UserHeader() {
    const sessionUser = useAuthStore((state) => state.sessionUser);

    const userLinks = [
        { label: 'Mi armario', path: '/closet' },
        { label: 'Mis conjuntos', path: '/outfits' },
        { label: 'Subir prenda', path: '/clothing' },
        { label: 'Crear conjunto', path: '/outfitCreator' },
    ];

    const state = useAuthStore();
    const userRepository = createUserRepository();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const result = await userRepository.logout();
            if (result.error) {
                toast.error('Error al cerrar sesión');
                return;
            }
            state.clearSession();
            navigate('/');
        } catch (error) {
            toast.error('Ocurrió un error inesperado');
            console.log(error);
        }
    }

    const avatarImg = sessionUser?.profile?.url_avatar ? sessionUser.profile.url_avatar : "/img/Default-Profile-Picture.jfif";

    return (
        /* 1. Fondo principal: de azul primario a gris casi negro */
        <header className="flex justify-between items-center px-6 py-2 bg-primary-700 dark:bg-slate-950 border-b border-primary-600 dark:border-slate-800 transition-colors duration-300">
            
            <div className="logo">
                <Link to="/">
                    {/* Si tienes un logo para modo oscuro, podrías alternarlo aquí */}
                    <img src="/img/white-logo.png" alt="Logo de Vesto" className="h-12 w-auto" />
                </Link>
            </div>
            
            <div className='flex gap-6 items-center'>
                {/* 2. El Navbar: Asegúrate de que dentro de <Navbar /> uses dark:text-gray-300 o similar */}
                <Navbar links={userLinks} isUser className="text-white dark:text-slate-300" />

                <div className="flex items-center gap-4">
                    {/* Foto de Perfil con un anillo que cambia de color */}
                    <Link to="/profile" className="block h-10 w-10">
                        <img
                            src={avatarImg}
                            alt="Imagen de Perfil"
                            className="h-full w-full object-cover rounded-full border-2 border-transparent hover:border-white dark:hover:border-primary-400 transition-all"
                        />
                    </Link>

                    {/* Botón de Modo Oscuro */}
                    <ThemeToggle />

                    {/* 3. Botón Logout: Cambia el estilo del borde/fondo en modo oscuro */}
                    <Button 
                        variant='out' 
                        onClick={handleLogout} 
                        className='rounded-full min-w-0 p-2 text-white border-white hover:bg-white/10 dark:text-slate-400 dark:border-slate-700 dark:hover:bg-slate-800'
                    >
                        <LogOut size={20} strokeWidth={2.5} />
                    </Button>                       
                </div>
            </div>
        </header>
    );
}