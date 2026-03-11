import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../components/common/Button';
import { useTranslation } from "react-i18next";
import RodasImg from "../img/Rodas.png";
import GabinoImg from "../img/Gabino.png";
import GloriajinImg from "../img/Gloriajin.png";
import LuciaImg from "../img/Lucia.png";
import MiguelImg from "../img/Miguel.png";
import Orb from '../components/common/Orb';
import Aurora from '../components/common/Aurora';
import { useAuthStore } from '../stores/authStore';
import AnimatedCard from '../components/common/AnimatedCard';

export default function LandingPage() {
    const { t } = useTranslation();

    // Ejemplo de funcionamiento de translate
    // <h1>{t('welcome', { user: sessionUser?.profile?.username || 'Invitado' })}</h1>
    // <button>{t('actions.save')}</button>
    // Obtenemos el hash de la URL (ej: #funcionamiento)
    const { hash } = useLocation();

    // Este efecto se ejecuta cada vez que el hash cambia
    useEffect(() => {
        if (hash) {
            // Quitamos el símbolo '#' para obtener solo el ID
            const id = hash.replace('#', '');
            const element = document.getElementById(id);

            if (element) {
                // Hacemos scroll suave hacia el elemento
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [hash]);

    const { isAuthenticated } = useAuthStore();


    return (

        <main className="w-full bg-auxiliary-50">

            {/* --- SECCIÓN 1: HERO --- */}
            <section id="hero" className="h-screen w-full bg-linear-to-br from-auxiliary-700 to-auxiliary-50 flex items-center justify-center font-sans px-6 md:px-12 lg:px-16">

                <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">

                    {/* --- COLUMNA IZQUIERDA --- */}
                    <div className="flex flex-col items-start gap-6">

                        {/* LOGO */}
                        <Link to="#hero">
                            <img
                                src="/img/black-logo.png"
                                alt="Logo de Vesto"
                                className="h-16 md:h-24 lg:h-32 w-auto"
                            />
                        </Link>

                        {/* TEXTO */}
                        <div className="flex flex-col gap-3">
                            <h1 className="font-(--font-display) text-3xl md:text-4xl lg:text-5xl font-bold text-black leading-tight">
                                Viste mejor en segundos.
                            </h1>
                            <p className="font-(--font-display) text-base md:text-lg lg:text-xl text-black max-w-md">
                                Organiza tu armario y crea outfits personalizados sin perder tiempo cada mañana.
                            </p>
                        </div>

                        {/* BOTONES */}
                        {isAuthenticated ? (
                            <Link to="/closet">
                                <Button variant='primary'>Ir a mi armario</Button>
                            </Link>
                        ) : (
                            <div className="flex gap-4">
                                <Link to="/login"><Button variant='primary'>Iniciar sesión</Button></Link>
                                <Link to="/signup"><Button variant='auxiliar'>Registro</Button></Link>
                            </div>
                        )}
                    </div>

                    {/* --- COLUMNA DERECHA --- */}
                    {/* En móvil se oculta para no saturar el hero */}
                    <div className="hidden md:flex justify-end items-center h-full">
                        <img
                            src="/img/walking-man.png"
                            alt="Ilustración persona caminando"
                            className="w-full max-w-xs lg:max-w-md animate-walkInLeft"
                        />
                    </div>

                </div>
            </section>

            {/* --- SECCIÓN 2: INFO CARDS --- */}
            <section className="relative w-full py-12 md:py-20 px-4 md:px-16 lg:px-32 flex flex-col items-center gap-10 md:gap-16 overflow-hidden">

                {/* --- ORBS DECORATIVAS DE FONDO --- */}
                <div className="absolute top-2 left-2 w-96 h-96 opacity-50 pointer-events-none z-0">
                    <Orb hoverIntensity={0.5} />
                </div>
                <div className="absolute top-100 right-2 w-80 h-80 opacity-50 pointer-events-none z-0">
                    <Orb hoverIntensity={0.5} />
                </div>
                <div className="absolute bottom-20 left-2 w-72 h-72 opacity-50 pointer-events-none z-0">
                    <Orb hoverIntensity={0.5} />
                </div>

                <div className="relative z-10 w-full flex flex-col items-center gap-10 md:gap-16">

                    {/* CARD 1: CÓMO FUNCIONA */}
                    <AnimatedCard id="funcionamiento" className="scroll-mt-25 w-full max-w-7xl bg-white rounded-4xl shadow-xl p-6 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
                        <div className="flex flex-col gap-6">
                            <h2 className="text-2xl md:text-4xl font-bold text-black font-(--font-display)">
                                ¿Cómo funciona Vesto?
                            </h2>
                            <p className="text-black text-base md:text-lg font-(--font-body)">
                                Tenemos un diseño intuitivo y fácil de usar, con funciones como subir fotos de tu ropa, crear outfits personalizados, guardar en favoritos... Todo para que elegir tu look diario sea rápido, divertido y sin complicaciones.
                            </p>
                        </div>

                        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-black flex items-center justify-center">
                            <div className="absolute inset-0 z-0">
                                <Aurora
                                    colorStops={["#7cff67", "#B19EEF", "#5227FF"]}
                                    blend={0.5}
                                    amplitude={1.0}
                                    speed={1}
                                />
                            </div>
                            <div className="relative z-10 text-center px-4 pointer-events-none">
                                <h3 className="text-white text-xl md:text-2xl font-bold mb-2 font-(--font-display)">Demo de Vesto</h3>
                                <p className="text-gray-300 text-sm font-(--font-body)">Próximamente el video de la app...</p>
                            </div>
                        </div>
                    </AnimatedCard>

                    {/* CARD 2: RECOMENDACIONES */}
                    <AnimatedCard id="reviews" delay={100} className="scroll-mt-25 w-full max-w-7xl bg-white rounded-4xl shadow-xl p-6 md:p-12 flex flex-col items-center gap-8 md:gap-12">
                        <h2 className="text-2xl md:text-4xl font-bold text-black text-center font-(--font-display)">
                            +50K usuarios satisfechos
                        </h2>
                        {/* En móvil 2 columnas, en md 4 columnas */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 w-full">
                            <div className="flex flex-col items-center text-center gap-2">
                                <img src="/img/angel.png" alt="Usuario" className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover avatar-interactive" />
                                <h3 className="font-bold text-base md:text-lg text-black font-(--font-body)">Ángel</h3>
                                <img src="/img/stars.png" alt="5 estrellas" className="h-4 md:h-5 w-auto" />
                                <p className="text-xs md:text-sm text-black px-2 font-(--font-body)">
                                    Obra de arte se nota la mano de Manuel en esta app, me ha cambiado la vida, ahora elegir qué ponerme es un placer y no una tortura. ¡Gracias Vesto!
                                </p>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2">
                                <img src="/img/jesus.png" alt="Usuario" className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover avatar-interactive" />
                                <h3 className="font-bold text-base md:text-lg text-black font-(--font-body)">Jesús</h3>
                                <img src="/img/stars.png" alt="5 estrellas" className="h-4 md:h-5 w-auto" />
                                <p className="text-xs md:text-sm text-black px-2 font-(--font-body)">
                                    Desde que la uso soy más feliz, gracias a Vesto he descubierto combinaciones que no se me habrían ocurrido. ¡Recomendada al 100%!
                                </p>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2">
                                <img src="/img/paco.png" alt="Usuario" className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover avatar-interactive" />
                                <h3 className="font-bold text-base md:text-lg text-black font-(--font-body)">Paco</h3>
                                <img src="/img/stars.png" alt="5 estrellas" className="h-4 md:h-5 w-auto" />
                                <p className="text-xs md:text-sm text-black px-2 font-(--font-body)">
                                    Tus ojos son como dos sartenes, cuando los veo se me fríen los huevos.
                                    Estás tan buena que te comía con ropa y todo... aunque pasara un mes cagando trapos.
                                </p>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2">
                                <img src="/img/elias.png" alt="Usuario" className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover avatar-interactive" />
                                <h3 className="font-bold text-base md:text-lg text-black font-(--font-body)">Elías</h3>
                                <img src="/img/stars.png" alt="5 estrellas" className="h-4 md:h-5 w-auto" />
                                <p className="text-xs md:text-sm text-black px-2 font-(--font-body)">
                                    No había visto una app tan completa. ¡Vesto ha revolucionado mi forma de elegir la ropa! Es como tener un estilista personal en el bolsillo.
                                </p>
                            </div>
                        </div>
                    </AnimatedCard>

                    {/* CARD 3: EQUIPO */}
                    <AnimatedCard id="equipo" delay={200} className="scroll-mt-25 w-full max-w-7xl bg-white rounded-4xl shadow-xl p-6 md:p-12 flex flex-col items-center gap-8 md:gap-12">
                        <div className="text-center max-w-3xl">
                            <h2 className="text-2xl md:text-4xl font-bold text-black mb-4 font-(--font-display)">
                                Nuestro equipo
                            </h2>
                            <p className="text-black text-base md:text-lg font-(--font-body)">
                                Los verdaderos creadores de Vesto.
                            </p>
                        </div>
                        {/* flex-wrap ya funciona bien en móvil, solo ajustamos gap */}
                        <div className="flex flex-wrap justify-center gap-8 md:gap-12 w-full">

                            {[
                                { src: RodasImg, name: 'Rodas', desc: 'Cabra absoluta, no necesita presentación.', bg: 'bg-orange-500' },
                                { src: GabinoImg, name: 'Pepe', desc: 'Aporta mucha veteranía, tiene más años que un bosque.', bg: 'bg-white' },
                                { src: GloriajinImg, name: 'Gloriajin', desc: 'Diva absoluta, le da el toque chick.', bg: 'bg-orange-500' },
                                { src: MiguelImg, name: 'Miguel', desc: 'Obsesionado con el trabajo, dentro y fuera del campo.', bg: 'bg-white' },
                                { src: LuciaImg, name: 'Lucía', desc: 'Sabe demasiado de todo, pero no lo dice, ¿falsa humilde?', bg: 'bg-orange-500' },
                            ].map(({ src, name, desc, bg }) => (
                                <div key={name} className="flex flex-col items-center text-center gap-2 w-28 md:w-32">
                                    <div className="relative w-24 h-24 md:w-28 md:h-28 mb-2 group cursor-pointer">
                                        <img src={src} alt={name} className="absolute inset-0 w-full h-full rounded-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0 z-10" />
                                        <img src="/img/black-logo.png" alt="Logo de Vesto" className={`absolute inset-0 w-full h-full rounded-full object-contain ${bg} p-3 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 z-0 shadow-inner`} />
                                    </div>
                                    <h3 className="font-bold text-base md:text-lg text-black font-(--font-body)">{name}</h3>
                                    <p className="text-xs md:text-sm text-black font-(--font-body)">{desc}</p>
                                </div>
                            ))}

                        </div>
                    </AnimatedCard>

                </div>
            </section>

        </main>
    );
}

