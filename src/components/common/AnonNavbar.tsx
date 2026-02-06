import { Link } from 'react-router-dom'

export default function AnonNavbar() {

    return (
        <header className="main-header">
            <div className="logo">
                <Link to="/">
                    <img src="/logo.png" alt="Logo de Vesto" />
                </Link>
            </div>

            <nav className="link-group">
                <Link to="/">Inicio</Link>
                <Link to="/seccion1">Sección1</Link>
                <Link to="/seccion2">Sección2</Link>
                <Link to="/products">Productos</Link>
                <div className='button-group'>
                    {/* <Button>Iniciar sesión</Button>
                    <Button>Registro</Button> */}
                </div>
            </nav>

        </header>
    )
}
