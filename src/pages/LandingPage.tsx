import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../components/common/Button';
import { useTranslation } from "react-i18next";
import RodasImg from "../img/Rodas.png";
import GabinoImg from "../img/Gabino.png";
import GloriaImg from "../img/Gloria.jpeg";
import LuciaImg from "../img/Lucia.jpeg";
import MiguelImg from "../img/Miguel.png";
import { useAuthStore } from '../stores/authStore';
import AnimatedCard from '../components/common/AnimatedCard';

/**
 * Componente `LandingPage`.
 * * Representa la página de inicio pública de la aplicación.
 * Contiene el Hero principal, explicación del funcionamiento, reseñas y presentación del equipo.
 * Incluye scroll suave hacia las secciones utilizando el hash de la URL.
 * Soporta Modo Oscuro de forma integral en sus tarjetas y fondos.
 * @returns {JSX.Element} La vista completa de la Landing Page.
 */
export default function LandingPage() {
    const { t } = useTranslation();
    const { hash } = useLocation();
    const { isAuthenticated } = useAuthStore();

    /**
     * Efecto que escucha los cambios en el hash de la URL (ej: /#equipo) 
     * y realiza un scroll suave hacia la sección correspondiente.
     */
    useEffect(() => {
        if (hash) {
            const id = hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [hash]);

    return (
        <main className="w-full bg-auxiliary-50 dark:bg-gray-950 transition-colors duration-500">
            {/* --- SECCIÓN 1: HERO --- */}
            <section id="hero" className="w-full bg-linear-to-br from-auxiliary-700 to-auxiliary-50 dark:from-gray-900 dark:to-gray-950 flex items-start justify-start md:items-center md:justify-center font-sans py-10 sm:py-14 md:min-h-[50vh] lg:min-h-screen transition-colors duration-500">
                <div className="container mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start md:items-center">
                        {/* COLUMNA IZQUIERDA */}
                        <div className="flex flex-col items-start text-left gap-6 w-full">
                            <Link to="#hero">
                                <img src="/img/black-logo.png" alt="Logo de Vesto" className="h-20 md:h-24 lg:h-32 w-auto dark:invert transition-all duration-300" />
                            </Link>

                            <div className="flex flex-col gap-4 max-w-xl">
                                <h1 className="font-(--font-display) text-3xl md:text-4xl lg:text-5xl font-bold text-black dark:text-white transition-colors duration-300">
                                    {t('landing.hero.title')}
                                </h1>
                                <p className="font-(--font-display) text-base md:text-lg lg:text-xl text-black dark:text-gray-300 transition-colors duration-300">
                                    {t('landing.hero.description')}
                                </p>
                            </div>

                            {isAuthenticated ? (
                                <Link to="/closet" className="w-full sm:w-auto">
                                    <Button className="w-full sm:w-auto" variant='primary'>{t('landing.hero.goToCloset')}</Button>
                                </Link>
                            ) : (
                                <div className="flex flex-col sm:flex-row items-center sm:items-stretch justify-center md:justify-start gap-3 w-full sm:w-auto">
                                    <Link to="/login" className="w-full sm:w-auto"><Button className="w-full sm:w-auto" variant='primary'>{t('landing.hero.login')}</Button></Link>
                                    <Link to="/signup" className="w-full sm:w-auto"><Button className="w-full sm:w-auto" variant='auxiliar'>{t('landing.hero.signup')}</Button></Link>
                                </div>
                            )}
                        </div>

                        {/* COLUMNA DERECHA */}
                        <div className="hidden md:flex justify-end items-center h-full">
                            <img src="/img/walking-man.png" alt="Ilustración persona caminando" className="w-full max-w-xs lg:max-w-md animate-walkInLeft" />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SECCIÓN 2: INFO CARDS --- */}
            <section className="relative w-full py-12 md:py-20 overflow-hidden">
<div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10 flex flex-col items-center gap-10 md:gap-16">
                    {/* CARD 1: CÓMO FUNCIONA */}
                    <AnimatedCard id="funcionamiento" className="scroll-mt-25 w-full bg-white dark:bg-gray-900 rounded-4xl shadow-xl dark:shadow-none p-6 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center transition-colors duration-500">
                        <div className="flex flex-col gap-6">
                            <h2 className="text-2xl md:text-4xl font-bold text-black dark:text-white font-(--font-display) transition-colors duration-300">{t('landing.howItWorks.title')}</h2>
                            <p className="text-black dark:text-gray-300 text-base md:text-lg font-(--font-body) transition-colors duration-300">{t('landing.howItWorks.description')}</p>
                            <Link to="/login">
                                <Button variant='primary'>{t('landing.howItWorks.cta')}</Button>
                            </Link>
                        </div>
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
                            <img src="/img/preview.png" alt={t('landing.howItWorks.demoTitle')} className="w-full h-full object-cover" />
                        </div>
                    </AnimatedCard>

                    {/* CARD 2: REVIEWS */}
                    <AnimatedCard id="reviews" delay={100} className="scroll-mt-25 w-full bg-white dark:bg-gray-900 rounded-4xl shadow-xl dark:shadow-none p-6 md:p-12 flex flex-col items-center gap-8 md:gap-12 transition-colors duration-500">
                        <h2 className="text-2xl md:text-4xl font-bold text-black dark:text-white text-center font-(--font-display) transition-colors duration-300">{t('landing.reviews.title')}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 w-full">
                            {/* Review Ángel */}
                            <AnimatedCard delay={0} className="flex flex-col items-center text-center gap-2">
                                <img src="/img/angel.jpg" alt="Usuario" className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover" />
                                <h3 className="font-bold text-base md:text-lg text-black dark:text-white font-(--font-body) transition-colors duration-300">Ángel</h3>
                                <img src="/img/stars.png" alt="5 estrellas" className="h-4 md:h-5 w-auto" />
                                <p className="text-xs md:text-sm text-black dark:text-gray-300 px-2 font-(--font-body) transition-colors duration-300">{t('landing.reviews.angel')}</p>
                            </AnimatedCard>
                            {/* Review Jesús */}
                            <AnimatedCard delay={150} className="flex flex-col items-center text-center gap-2">
                                <img src="/img/jesus.jpg" alt="Usuario" className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover" />
                                <h3 className="font-bold text-base md:text-lg text-black dark:text-white font-(--font-body) transition-colors duration-300">Jesús</h3>
                                <img src="/img/stars.png" alt="5 estrellas" className="h-4 md:h-5 w-auto" />
                                <p className="text-xs md:text-sm text-black dark:text-gray-300 px-2 font-(--font-body) transition-colors duration-300">{t('landing.reviews.jesus')}</p>
                            </AnimatedCard>
                            {/* Review Paco */}
                            <AnimatedCard delay={300} className="flex flex-col items-center text-center gap-2">
                                <img src="/img/paco.jpg" alt="Usuario" className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover" />
                                <h3 className="font-bold text-base md:text-lg text-black dark:text-white font-(--font-body) transition-colors duration-300">Paco</h3>
                                <img src="/img/stars.png" alt="5 estrellas" className="h-4 md:h-5 w-auto" />
                                <p className="text-xs md:text-sm text-black dark:text-gray-300 px-2 font-(--font-body) transition-colors duration-300">{t('landing.reviews.paco')}</p>
                            </AnimatedCard>
                            {/* Review Elías */}
                            <AnimatedCard delay={450} className="flex flex-col items-center text-center gap-2">
                                <img src="/img/elias.jpg" alt="Usuario" className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover" />
                                <h3 className="font-bold text-base md:text-lg text-black dark:text-white font-(--font-body) transition-colors duration-300">Elías</h3>
                                <img src="/img/stars.png" alt="5 estrellas" className="h-4 md:h-5 w-auto" />
                                <p className="text-xs md:text-sm text-black dark:text-gray-300 px-2 font-(--font-body) transition-colors duration-300">{t('landing.reviews.elias')}</p>
                            </AnimatedCard>
                        </div>
                    </AnimatedCard>

                    {/* CARD 3: EQUIPO */}
                    <AnimatedCard id="equipo" delay={200} className="scroll-mt-25 w-full bg-white dark:bg-gray-900 rounded-4xl shadow-xl dark:shadow-none p-6 md:p-12 flex flex-col items-center gap-8 md:gap-12 transition-colors duration-500">
                        <div className="text-center max-w-3xl">
                            <h2 className="text-2xl md:text-4xl font-bold text-black dark:text-white mb-4 font-(--font-display) transition-colors duration-300">{t('landing.team.title')}</h2>
                            <p className="text-black dark:text-gray-300 text-base md:text-lg font-(--font-body) transition-colors duration-300">{t('landing.team.subtitle')}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 justify-items-center gap-6 md:gap-10 w-full max-w-5xl">
                            {/* Rodas */}
                            <AnimatedCard delay={0} className="flex flex-col items-center text-center gap-2 w-full max-w-xs">
                                <div className="relative w-24 h-24 md:w-28 md:h-28 mb-2 group cursor-pointer">
                                    <img src={RodasImg} alt="Rodas" className="absolute inset-0 w-full h-full rounded-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0 z-10" />
                                    <img src="/img/black-logo.png" alt="Logo de Vesto" className="absolute inset-0 w-full h-full rounded-full object-contain bg-orange-500 p-3 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 z-0 shadow-inner" />
                                </div>
                                <h3 className="font-bold text-base md:text-lg text-black dark:text-white font-(--font-body) transition-colors duration-300">Manuel Rodas</h3>
                                <p className="text-xs md:text-sm text-black dark:text-gray-300 font-(--font-body) transition-colors duration-300">{t('landing.team.rodas')}</p>
                            </AnimatedCard>
                            {/* Pepe */}
                            <AnimatedCard delay={100} className="flex flex-col items-center text-center gap-2 w-full max-w-xs">
                                <div className="relative w-24 h-24 md:w-28 md:h-28 mb-2 group cursor-pointer">
                                    <img src={GabinoImg} alt="Gabino" className="absolute inset-0 w-full h-full rounded-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0 z-10" />
                                    <img src="/img/black-logo.png" alt="Logo de Vesto" className="absolute inset-0 w-full h-full rounded-full object-contain bg-white p-3 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 z-0 shadow-inner" />
                                </div>
                                <h3 className="font-bold text-base md:text-lg text-black dark:text-white font-(--font-body) transition-colors duration-300">Gabino Muriel</h3>
                                <p className="text-xs md:text-sm text-black dark:text-gray-300 font-(--font-body) transition-colors duration-300">{t('landing.team.pepe')}</p>
                            </AnimatedCard>
                            {/* Gloria */}
                            <AnimatedCard delay={200} className="flex flex-col items-center text-center gap-2 w-full max-w-xs">
                                <div className="relative w-24 h-24 md:w-28 md:h-28 mb-2 group cursor-pointer">
                                    <img src={GloriaImg} alt="Gloria" className="absolute inset-0 w-full h-full rounded-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0 z-10" />
                                    <img src="/img/black-logo.png" alt="Logo de Vesto" className="absolute inset-0 w-full h-full rounded-full object-contain bg-orange-500 p-3 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 z-0 shadow-inner" />
                                </div>
                                <h3 className="font-bold text-base md:text-lg text-black dark:text-white font-(--font-body) transition-colors duration-300">Gloria Curado</h3>
                                <p className="text-xs md:text-sm text-black dark:text-gray-300 font-(--font-body) transition-colors duration-300">{t('landing.team.gloria')}</p>
                            </AnimatedCard>
                            {/* Miguel */}
                            <AnimatedCard delay={300} className="flex flex-col items-center text-center gap-2 w-full max-w-xs">
                                <div className="relative w-24 h-24 md:w-28 md:h-28 mb-2 group cursor-pointer">
                                    <img src={MiguelImg} alt="Miguel" className="absolute inset-0 w-full h-full rounded-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0 z-10" />
                                    <img src="/img/black-logo.png" alt="Logo de Vesto" className="absolute inset-0 w-full h-full rounded-full object-contain bg-white p-3 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 z-0 shadow-inner" />
                                </div>
                                <h3 className="font-bold text-base md:text-lg text-black dark:text-white font-(--font-body) transition-colors duration-300">Miguel González</h3>
                                <p className="text-xs md:text-sm text-black dark:text-gray-300 font-(--font-body) transition-colors duration-300">{t('landing.team.miguel')}</p>
                            </AnimatedCard>
                            {/* Lucía */}
                            <AnimatedCard delay={400} className="flex flex-col items-center text-center gap-2 w-full max-w-xs">
                                <div className="relative w-24 h-24 md:w-28 md:h-28 mb-2 group cursor-pointer">
                                    <img src={LuciaImg} alt="Lucía" className="absolute inset-0 w-full h-full rounded-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0 z-10" />
                                    <img src="/img/black-logo.png" alt="Logo de Vesto" className="absolute inset-0 w-full h-full rounded-full object-contain bg-orange-500 p-3 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 z-0 shadow-inner" />
                                </div>
                                <h3 className="font-bold text-base md:text-lg text-black dark:text-white font-(--font-body) transition-colors duration-300">Lucía Fernández</h3>
                                <p className="text-xs md:text-sm text-black dark:text-gray-300 font-(--font-body) transition-colors duration-300">{t('landing.team.lucia')}</p>
                            </AnimatedCard>
                        </div>
                    </AnimatedCard>
                </div>
            </section>
        </main>
    );
}