import { Link } from 'react-router-dom';

// 1. Define la interfaz para las propiedades
interface FooterProps {
    isUser?: boolean;
}

// 2. Asigna la interfaz al componente
export default function Footer({ isUser = false }: FooterProps) {
    
    // Configuración de colores sincronizada
    const bgColor = isUser ? "bg-[var(--color-primary-700)]" : "bg-[var(--color-auxiliary-700)]";
    const textColor = isUser ? "text-white" : "text-black";
    const logoSrc = isUser ? "/img/white-logo.png" : "/img/black-logo.png";
    const iconSuffix = isUser ? "white" : "black";

    return (
        <footer className={`${bgColor} ${textColor} px-12 py-10 flex flex-col md:flex-row justify-between items-center md:items-start gap-8 font-[var(--font-body)] transition-colors duration-300`}>
            
            <div className="shrink-0">
                <Link to="/">
                    <img 
                        src={logoSrc} 
                        alt="Vesto Logo" 
                        className="h-14 w-auto object-contain" 
                    />
                </Link>
            </div>

            {/* Links centrales basados en el diseño */}
            <div className="flex flex-1 justify-center gap-16 md:gap-24">
                <ul className="flex flex-col gap-1 text-inherit">
                    <li><Link to="/feed" className="hover:opacity-70 text-sm font-medium">Feed</Link></li>
                    <li><Link to="/products" className="hover:opacity-70 text-sm font-medium">Products</Link></li>
                    <li><Link to="/seccion1" className="hover:opacity-70 text-sm font-medium">Discover</Link></li>
                </ul>

                <ul className="flex flex-col gap-1 text-inherit">
                    <li><Link to="/help" className="hover:opacity-70 text-sm font-medium">Help</Link></li>
                    <li><Link to="/terms" className="hover:opacity-70 text-sm font-medium">Terms</Link></li>
                    <li><Link to="/copyright" className="hover:opacity-70 text-sm font-medium">Copyright Policy</Link></li>
                </ul>
            </div>

            {/* Alineación a la derecha para "Download" */}
            <div className="flex flex-col items-center md:items-end gap-5 md:ml-auto">
                <span className="text-sm font-bold tracking-wide">Download</span>
                
                <div className="flex items-center gap-6">
                    <img src={`/img/apple-${iconSuffix}.png`} alt="App Store" className="h-7 w-auto" />
                    <img src={`/img/google-${iconSuffix}.png`} alt="Play Store" className="h-7 w-auto" />
                    
                    <button 
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="ml-4"
                        aria-label="Volver arriba"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 11l7-7 7 7M5 19l7-7 7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </footer>
    );
}