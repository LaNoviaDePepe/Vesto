import { Link } from 'react-router-dom';

interface FooterProps {
    variant?: 1 | 2;
}

export default function Footer({ variant = 1 }: FooterProps) {

    const isOption1 = variant === 1;
    
    const bgColor = isOption1 ? "bg-primary-700" : "bg-auxiliary-700";
    const textColor = isOption1 ? "text-white" : "text-black";
    const logoSrc = isOption1 ? "/img/white-logo.png" : "/img/black-logo.png";
    const iconSuffix = isOption1 ? "white" : "black";

    return (
        <footer className={`${bgColor} ${textColor} px-12 py-10 flex flex-col md:flex-row justify-between items-center md:items-start gap-8 font-(--font-body) transition-colors duration-300`}>
            
            <div className="shrink-0">
                <Link to="/">
                    <img 
                        src={logoSrc} 
                        alt="Vesto Logo" 
                        className="h-14 w-auto object-contain" 
                    />
                </Link>
            </div>
            <div className="flex flex-1 justify-center gap-16 md:gap-24">
                <ul className="flex flex-col gap-1 text-inherit">
                    <li><Link to="/feed" className="hover:opacity-70 transition-opacity text-sm font-medium">Feed</Link></li>
                    <li><Link to="/products" className="hover:opacity-70 transition-opacity text-sm font-medium">Products</Link></li>  {/* Cambiado products por shop */}
                    <li><Link to="/seccion1" className="hover:opacity-70 transition-opacity text-sm font-medium">Discover</Link></li>
                </ul>

                <ul className="flex flex-col gap-1 text-inherit">
                    <li><Link to="/help" className="hover:opacity-70 transition-opacity text-sm font-medium">Help</Link></li>
                    <li><Link to="/terms" className="hover:opacity-70 transition-opacity text-sm font-medium">Terms</Link></li>
                    <li><Link to="/copyright" className="hover:opacity-70 transition-opacity text-sm font-medium">Copyright Policy</Link></li>
                </ul>
            </div>

            <div className="flex flex-col items-center md:items-end gap-5">
                <span className="text-sm font-bold tracking-wide">Download</span>
                
                <div className="flex items-center gap-6">
                    <a href="https://apple.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                        <img src={`/img/apple-${iconSuffix}.png`} alt="App Store" className="h-7 w-auto" />
                    </a>
                    
                    <a href="https://google.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                        <img src={`/img/google-${iconSuffix}.png`} alt="Play Store" className="h-7 w-auto" />
                    </a>
                    
                    <button 
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="ml-4 hover:-translate-y-1 transition-transform border-none bg-transparent cursor-pointer"
                        aria-label="Volver arriba"
                    >
                        <svg 
                            className="w-6 h-6" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2.5" 
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 11l7-7 7 7M5 19l7-7 7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </footer>
    );
}