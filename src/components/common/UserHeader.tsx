import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Button from './Button';
import { createUserRepository } from '../../database/repositories';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';
import { LogOut } from 'lucide-react';


export default function UserHeader() {
    // Constante que almacena los links para los usuarios registrados
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
            // Limpiamos sesión usando la función del store y redirigimos a otra página
            state.clearSession();
            navigate('/');

        } catch (error) {
            toast.error('Ocurrió un error inesperado');
            console.log(error);
        }
    }

    return (
        <header className="bg-primary-700 fixed top-0 w-full z-50">

            <div className="logo">
                <Link to="/">
                    <img src="/img/white-logo.png" alt="Logo de Vesto" className="h-15 w-auto" />
                </Link>
            </div>
            <div className='flex gap-3'>
                <Navbar links={userLinks} isUser />

                <div className="flex items-center">
                    <Link to="/profile" className="block h-15 w-auto">
                        <img
                            src="/img/profile-picture.png"
                            alt="Imagen de Perfil"
                            className="h-full w-full object-cover shadow-sm"
                        />
                    </Link>

                    <Button variant='out' onClick={handleLogout} className='rounded-full min-w-0 ml-3'>
                        <LogOut size={20} strokeWidth={2.5} />
                    </Button>                       
                </div>
            </div>
        </header>
    );
}