import { Link } from 'react-router-dom';
import Navbar from './Navbar';

export default function UserHeader() {
    // Constante que almacena los links para los usuarios registrados
    const userLinks = [
        { label: 'Mi armario', path: '/closet' },
        { label: 'Mis conjuntos', path: '/outfits' },
        { label: 'Subir prenda', path: '/clothing' },
        { label: 'Crear conjunto', path: '/outfitCreator' },
    ];

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
                </div>
            </div>
        </header>
    );
}