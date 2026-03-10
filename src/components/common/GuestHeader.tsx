import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Button from './Button';

export default function GuestHeader() {
    // Función para forzar el scroll si ya estamos en la página
    const handleScrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Constante que almacena los links para los usuarios anónimos
    const guestLinks = [
        { label: 'Inicio', path: '/#hero' },
        { label: 'Funcionamiento', path: '/#funcionamiento' },
        { label: 'Reviews', path: '/#reviews' },
        { label: 'Equipo', path: '/#equipo' },
    ];

    return (
        <header className="bg-auxiliary-700 ">
            <div className="logo">
                <Link to="/#hero" onClick={() => handleScrollToSection('hero')}>
                    <img src="/img/black-logo.png" alt="Logo de Vesto" className="h-15 w-auto" />
                </Link>
            </div>
            <div className='flex gap-3'>
                <Navbar links={guestLinks} onLinkClick={handleScrollToSection}/>

                <div className='flex items-center gap-2'>
                    <Link to="/login"><Button variant='primary'>Iniciar sesión</Button></Link>
                    <Link to="/signup"><Button variant='auxiliar'>Registro</Button></Link>
                </div>
            </div>
        </header>
    );
}