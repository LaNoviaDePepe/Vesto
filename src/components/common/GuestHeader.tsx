import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Button from './Button';

/**
 * Componente funcional que renderiza el encabezado (Header) para los usuarios invitados (no autenticados).
 * Muestra el logotipo de la aplicación, una barra de navegación con anclas a secciones de la página principal,
 * y los botones de llamada a la acción (CTA) para iniciar sesión o registrarse.
 */
export default function GuestHeader() {
    // =========================================================================
    // Constante que almacena los links para los usuarios anónimos.
    // Utiliza rutas con anclas (hash links como '/#funcionamiento') para permitir 
    // la navegación suave (smooth scroll) hacia distintas secciones de la landing page.
    // =========================================================================
    const guestLinks = [
        { label: 'Inicio', path: '/' },
        { label: 'Funcionamiento', path: '/#funcionamiento' },
        { label: 'Reviews', path: '/#reviews' },
        { label: 'Equipo', path: '/#equipo' },
    ];

    return (
        <header className="bg-auxiliary-700 ">
            <div className="logo">
                <Link to="/">
                    <img src="/img/black-logo.png" alt="Logo de Vesto" className="h-15 w-auto" />
                </Link>
            </div>
            <div className='flex gap-3'>
                <Navbar links={guestLinks} />

                <div className='flex items-center gap-2'>
                    <Link to="/login"><Button variant='primary'>Iniciar sesión</Button></Link>
                    <Link to="/signup"><Button variant='auxiliar'>Registro</Button></Link>
                </div>
            </div>
        </header>
    );
}