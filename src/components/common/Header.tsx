import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { useState } from 'react';

export default function Header() {
    // Constantes que almacenan los links para los usuarios registrados o anónimos
    const guestLinks = [
        { label: 'Inicio', path: '/' },
        { label: 'Sección1', path: '/seccion1' },
        { label: 'Sección2', path: '/seccion2' },
        { label: 'Productos', path: '/products' },
    ];

    const userLinks = [
        { label: 'Mi armario', path: '/closet' },
        { label: 'Mis conjuntos', path: '/outfits' },
        { label: 'Subir prenda', path: '/clothing' },
        { label: 'Crear conjunto', path: '/outfitCreator' },
    ];

    // Estado que almacena el estado de login (demoooo)
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <header className="flex items-center justify-between px-6 py-4 bg-auxiliary-700 h-20">
            <div className="logo">
                <Link to="/">
                    <img src="/logo.png" alt="Logo de Vesto" className="h-10 w-auto" />
                </Link>
            </div>

            {
                !isLoggedIn && (

                    <>
                        <Navbar links={guestLinks} />
                        <div className="flex items-center gap-2">
                            <button className="btn-primary">Iniciar sesión</button>
                            <button className="btn-auxiliar">Registro</button>
                        </div>
                    </>
                )
            }
            
            {
                isLoggedIn && (

                    <>
                        <Navbar links={userLinks} />
                    </>
                )
            }
        </header>
    );
}