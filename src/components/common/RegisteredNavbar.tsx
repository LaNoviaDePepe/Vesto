import { Link } from 'react-router-dom'

export default function RegisteredNavbar() {
    return (
        <header className="main-header">
            <div className="logo">
                <Link to="/">
                    <img src="/logo.png" alt="Logo de Vesto" />
                </Link>
            </div>

            <nav className="link-group">
                <Link to="/closet">Mi armario</Link>
                <Link to="/outfitCreator">Creador de conjuntos</Link>
                <Link to="/outfits">Conjuntos</Link>
                <Link to="/clothing">Subir prenda</Link>
                
            </nav>
            <div className="profile-icon">
                    <Link to="/profile">
                        <img src="/profileIcon.png" alt="Imagen de perfil del usuario" />
                    </Link>
                </div>

        </header>
    )
}

