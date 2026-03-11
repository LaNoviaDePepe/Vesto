import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Button from './Button';
import { createUserRepository } from '../../database/repositories';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';
import { LogOut } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

interface UserHeaderProps {
    children?: React.ReactNode; // Para los dos botones adicionales del admin
} 

export default function UserHeader({ children }: UserHeaderProps) {
        const sessionUser = useAuthStore((state) => state.sessionUser);
        const clearSession = useAuthStore((state) => state.clearSession);

    // Constante que almacena los links para los usuarios registrados
    const { t } = useTranslation();
    const userLinks = [
        { label: t('navbar.links.closet'), path: '/closet' },
        { label: t('navbar.links.outfits'), path: '/outfits' },
        { label: t('navbar.links.upload_clothing'), path: '/clothing' },
        { label: t('navbar.links.create_outfit'), path: '/outfitCreator' },
    ];


    const userRepository = createUserRepository();
    const navigate = useNavigate();

    const handleLogout = async () => {

        try {
            const result = await userRepository.logout();
            if (result.error) {
                toast.error(t('error.close_session'));

                return;
            }
            // Limpiamos sesión usando la función del store y redirigimos a otra página
            clearSession();
            navigate('/');

        } catch (error) {
            toast.error(t('error.random_error'));
            console.log(error);
        }
    }

        // Determinamos qué imagen mostrar: la de Supabase o la de por defecto
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
                    <LanguageSwitcher />                      
                </div>
            </div>
        </header>
    );
}