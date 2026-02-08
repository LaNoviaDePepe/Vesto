import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Button from './Button';

export default function GuestHeader() {
    // Constante que almacena los links para los usuarios anónimos
    const guestLinks = [
        { label: 'Inicio', path: '/' },
        { label: 'Sección1', path: '/seccion1' },
        { label: 'Sección2', path: '/seccion2' },
        { label: 'Productos', path: '/products' },
    ];

    return (
        <header className="bg-auxiliary-700">
            <div className="logo">
                <Link to="/">
                    <img src="/img/black-logo.png" alt="Logo de Vesto" className="h-15 w-auto" />
                </Link>
            </div>
<div className='flex gap-3'>
            <Navbar links={guestLinks} />

            <div className='flex items-center gap-2'>
                <Button variant='primary'>Iniciar sesión</Button>
                <Button variant='auxiliar'>Registro</Button>
            </div>
            </div>
        </header>
    );
}