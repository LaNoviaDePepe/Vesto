import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Button from './Button';
import { createUserRepository } from '../../database/repositories';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';
import { LogOut } from 'lucide-react';

import { motion } from 'framer-motion'; // 1. Importamos motion

interface UserHeaderProps {
    children?: React.ReactNode;
} 

export default function UserHeader({ children }: UserHeaderProps) {
    const sessionUser = useAuthStore((state) => state.sessionUser);
    const clearSession = useAuthStore((state) => state.clearSession);

    const userRepository = createUserRepository();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const result = await userRepository.logout();
            if (result.error) {
                toast.error('Error al cerrar sesión');
                return;
            }
            clearSession();
            navigate('/');
        } catch (error) {
            toast.error('Ocurrió un error inesperado');
            console.log(error);
        }
    }

    const userLinks = [
        { label: 'Mi armario', path: '/closet' },
        { label: 'Mis conjuntos', path: '/outfits' },
        { label: 'Subir prenda', path: '/clothing' },
        { label: 'Crear conjunto', path: '/outfitCreator' },
    ];

    const avatarImg = sessionUser?.profile?.url_avatar ? sessionUser.profile.url_avatar : "/img/Default-Profile-Picture.jfif";

    return (
        <header className="bg-primary-700">
            <div className="logo">
                <Link to="/">
                    <img src="/img/white-logo.png" alt="Logo de Vesto" className="h-15 w-auto" />
                </Link>
            </div>
            <div className='flex gap-3'>
                <Navbar links={userLinks} isUser />

                <div className="flex items-center gap-3">
                    {children}
                    <Link to="/profile" className="block h-15 w-15" title="Perfil de usuario">
                        <img
                            src={avatarImg}
                            alt="Perfil de usuario"
                            className="h-full w-full object-cover shadow-sm rounded-full"
                        />
                    </Link>

                    {/* 2. Añadimos 'group' a la clase para que el hover del botón afecte al hijo */}
                    <Button 
                        variant='icon' 
                        onClick={handleLogout} 
                        className='min-w-0 group' 
                        title="Cerrar sesión"
                    >
                        {/* 3. Envolvemos el icono de Lucide en un motion.div */}
                        <motion.div
                            variants={{
                                initial: { x: 0 },
                                animate: { x: [0, 3, 0] } // Pequeño rebote hacia la derecha
                            }}
                            whileHover="animate"
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                            <LogOut size={20} strokeWidth={2.5} />
                        </motion.div>
                    </Button>                       
                </div>
            </div>
        </header>
    );
}