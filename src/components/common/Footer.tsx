import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import TermsModal from './Modal/TermsModal';
import CopyrightModal from './Modal/CopyrightModal';
import { useState } from 'react';

// 1. Define la interfaz para las propiedades
interface FooterProps {
    isUser?: boolean;
}

// 2. Asigna la interfaz al componente
export default function Footer({ isUser = false }: FooterProps) {

    const { t } = useTranslation();

    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [isCopyrightOpen, setIsCopyrightOpen] = useState(false);
    // Configuración de colores sincronizada
    const bgColor = isUser ? "bg-[var(--color-auxiliary-700)]" : "bg-[var(--color-primary-700)]";
    const textColor = isUser ? "text-black" : "text-white";
    const logoSrc = isUser ? "/img/black-logo.png" : "/img/white-logo.png";

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
            <div className="flex flex-col items-center justify-center flex-1 gap-8 md:flex-row md:gap-24">
                <ul className="flex flex-col items-center gap-1 text-inherit">
                    <li><Link to="/feed" className="hover:opacity-70 text-sm font-medium">{t('footer.feed')}</Link></li>
                    <li><Link to="/products" className="hover:opacity-70 text-sm font-medium">{t('footer.products')}</Link></li>
                    <li><Link to="/seccion1" className="hover:opacity-70 text-sm font-medium">{t('footer.discover')}</Link></li>
                </ul>

                <ul className="flex flex-col items-center gap-1 text-inherit">
                    <li><Link to="/help" className="hover:opacity-70 text-sm font-medium">{t('footer.help')}</Link></li>
                    {/* Términos y condiciones */}
                    <li><button
                        type="button"
                        onClick={() => setIsTermsOpen(true)}
                        className="hover:opacity-70 text-sm font-medium h-auto py-1 leading-none hover:shadow-none hover:translate-0">{t('footer.terms')}
                    </button></li>

                    {/* Copyright */}
                    <li><button
                        type="button"
                        onClick={() => setIsCopyrightOpen(true)}
                        className="hover:opacity-70 text-sm font-medium h-auto py-1 leading-none hover:shadow-none hover:translate-0">{t('footer.copyright_policy')}
                    </button></li>
                </ul>
            </div>

            {/* Alineación a la derecha: Apps */}
            <div className="flex flex-col items-center md:items-end gap-6 md:ml-auto pr-4">

                {/* Bloque de Apps (Próximamente) */}
                <div className="flex flex-col items-center md:items-end gap-3">
                    <span className="text-sm font-bold tracking-wide">
                        {t('footer.coming_soon')}
                    </span>
                    <div className="flex items-center gap-4">
                        {/* ICONO APPLE (Deshabilitado) */}
                        <div
                            className="opacity-40 cursor-not-allowed transition-opacity"
                            title={t('footer.app_store_coming')}
                            aria-disabled="true"
                        >
                            <svg className="h-7 w-auto fill-current" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
                                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-54.5-91.9-54.1-118.8zM249.8 81.9c23.2-27.6 47.4-63.3 38.5-101.9-27.1 1.6-53.7 21.3-71.1 41.7-17 19.9-34.7 52.1-27.1 91.5 29.5 4.1 41.7-27.8 59.7-31.3z" />
                            </svg>
                        </div>

                        {/* ICONO GOOGLE PLAY (Deshabilitado) */}
                        <div
                            className="opacity-40 cursor-not-allowed transition-opacity"
                            title={t('footer.google_play_coming')}
                            aria-disabled="true"
                        >
                            <svg className="h-7 w-auto fill-current" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l220.7-221.3-60.1-60.1L69.6 462.9l-22.6 36.1H104.6z" />
                            </svg>
                        </div>
                    </div>
                </div>

            </div>

            {/* Modal de términos y condiciones */}
            <TermsModal
                isOpen={isTermsOpen}
                showCancel={false}
                onClose={() => setIsTermsOpen(false)}
                onConfirm={() => {setIsTermsOpen(false);
                }}
            />

            {/* Modal de Copyright*/}
            <CopyrightModal
                isOpen={isCopyrightOpen}
                showCancel={false}
                onClose={() => setIsCopyrightOpen(false)}
                onConfirm={() => setIsCopyrightOpen(false)}
            />
        </footer>
    );
}