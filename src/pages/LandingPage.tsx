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
            <section id="hero" className="min-h-screen w-full bg-linear-to-br from-auxiliary-700 to-auxiliary-50 flex items-center justify-center font-sans px-16 pb-8">

                <div className="max-w-7xl w-full grid grid-cols-2 gap-16 items-center">

                    {/* --- COLUMNA IZQUIERDA --- */}
                    <div className="flex flex-col items-start gap-8">

                        {/* CONTENEDOR ESPECÍFICO PARA LOGO + ORB */}
                        <div className="relative w-64 md:w-80 lg:w-96 aspect-square flex items-center justify-center">

                            <Orb hoverIntensity={0.5} />

                            <Link
                                to="#hero"
                                className="absolute flex items-center justify-center"
                            >
                                <img
                                    src="/img/black-logo.png"
                                    alt="Logo de Vesto"
                                    className="h-140 w-auto object-contain drop-shadow-lg"
                                />
                            </Link>

                        </div>

                        {/* TEXTO Y BOTONES */}
                        <p className="font-(--font-display) text-4xl text-black max-w-xl">
                            ¿Cansado de perder demasiado tiempo eligiendo qué ponerte cada día? Eligelo rápido con Vesto, la app que te ayuda a organizar tu armario y crear outfits personalizados en segundos.
                        </p>

                        {isAuthenticated ? (
                            <Link to="/closet">
                                <Button variant='primary'>Ir a mi armario</Button>
                            </Link>
                        ) : (
                            <div className="flex gap-4 mt-6 w-auto">
                                <Link to="/login"><Button variant='primary'>Iniciar sesión</Button></Link>
                                <Link to="/signup"><Button variant='auxiliar'>Registro</Button></Link>
                            </div>
                        )}

                    </div>

                    <div className="flex justify-end items-center h-full">
                        <img
                            src="/img/walking-man.png"
                            alt="Ilustración persona caminando"
                            className="w-full max-w-md object-contain animate-walkInLeft"
                        />
                    </div>

                </div>
            </section>

            {/* --- SECCIÓN 2: INFO CARDS --- */}
            <section className="w-full py-20 px-32 flex flex-col items-center gap-16">

                {/* CARD 1: CÓMO FUNCIONA */}
                <div id="funcionamiento" className="scroll-mt-25 w-full max-w-7xl bg-white rounded-4xl shadow-xl p-12 grid grid-cols-2 gap-16 items-center">
                    <div className="flex flex-col gap-6">
                        <h2 className="text-4xl font-bold text-black font-(--font-display)">
                            ¿Cómo funciona Vesto?
                        </h2>
                        <p className="text-black text-lg font-(--font-body)">
                            Tenemos un diseño intuitivo y fácil de usar, con funciones como subir fotos de tu ropa, crear outfits personalizados, guardar en favoritos... Todo para que elegir tu look diario sea rápido, divertido y sin complicaciones.
                        </p>
                    </div>

                    <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-black flex items-center justify-center">

                        {/* FONDO ANIMADO */}
                        <div className="absolute inset-0 z-0">
                            <Aurora
                                colorStops={["#7cff67", "#B19EEF", "#5227FF"]}
                                blend={0.5}
                                amplitude={1.0}
                                speed={1}
                            />
                        </div>

                        {/* TEXTO SUPERPUESTO */}
                        <div className="relative z-10 text-center px-4 pointer-events-none">
                            <h3 className="text-white text-2xl font-bold mb-2 font-(--font-display)">Demo de Vesto</h3>
                            <p className="text-gray-300 text-sm font-(--font-body)">Próximamente el video de la app...</p>
                        </div>

                    </div>
                </div>

                {/* CARD 2: RECOMENDACIONES */}
                <div id="reviews" className="scroll-mt-25 w-full max-w-7xl bg-white rounded-4xl shadow-xl p-12 flex flex-col items-center gap-12">
                    <h2 className="text-4xl font-bold text-black text-center font-(--font-display)">
                        +50K usuarios satisfechos
                    </h2>
                    <div className="grid grid-cols-4 gap-8 w-full">
                        <div className="flex flex-col items-center text-center gap-2">
                            {/* Avatar usuario */}
                            <img
                                src="/img/angel.png"
                                alt="Usuario"
                                className="w-24 h-24 rounded-full object-cover avatar-interactive"
                            />
                            <h3 className="font-bold text-lg text-black font-(--font-body)">Ángel</h3>
                            {/* Estrellas */}
                            <img
                                src="/img/stars.png"
                                alt="5 estrellas"
                                className="h-5 w-auto"
                            />
                            <p className="text-sm text-black px-2 font-(--font-body)">
                                Obra de arte se nota la mano de Manuel en esta app, me ha cambiado la vida, ahora elegir qué ponerme es un placer y no una tortura. ¡Gracias Vesto!
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center gap-2">
                            {/* Avatar usuario */}
                            <img
                                src="/img/jesus.png"
                                alt="Usuario"
                                className="w-24 h-24 rounded-full object-cover avatar-interactive"
                            />
                            <h3 className="font-bold text-lg text-black font-(--font-body)">Jesús</h3>
                            {/* Estrellas */}
                            <img
                                src="/img/stars.png"
                                alt="5 estrellas"
                                className="h-5 w-auto"
                            />
                            <p className="text-sm text-black px-2 font-(--font-body)">
                                Desde que la uso soy más feliz, gracias a Vesto he descubierto combinaciones de ropa que no se me habrían ocurrido, y ahora me siento más seguro con mi estilo. ¡Recomendada al 100%!
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center gap-2">
                            {/* Avatar usuario */}
                            <img
                                src="/img/paco.png"
                                alt="Usuario"
                                className="w-24 h-24 rounded-full object-cover avatar-interactive"
                            />
                            <h3 className="font-bold text-lg text-black font-(--font-body)">Paco</h3>
                            {/* Estrellas */}
                            <img
                                src="/img/stars.png"
                                alt="5 estrellas"
                                className="h-5 w-auto"
                            />
                            <p className="text-sm text-black px-2 font-(--font-body)">
                                Tus ojos son como dos sartenes, cuando los veo se me fri­en los huevos.
                                Estás tan buena que te comí­a con ropa y todo... aunque pasara un mes cagando trapos.
                            </p>
                        </div>
                        <div className="flex flex-col items-center text-center gap-2">
                            {/* Avatar usuario */}
                            <img
                                src="/img/elias.png"
                                alt="Usuario"
                                className="w-24 h-24 rounded-full object-cover avatar-interactive"
                            />
                            <h3 className="font-bold text-lg text-black font-(--font-body)">Elías</h3>
                            {/* Estrellas */}
                            <img
                                src="/img/stars.png"
                                alt="5 estrellas"
                                className="h-5 w-auto"
                            />
                            <p className="text-sm text-black px-2 font-(--font-body)">
                                No había visto una app tan completa y funcional. ¡Vesto ha revolucionado mi forma de elegir la ropa! Me encanta la función de crear outfits personalizados, es como tener un estilista personal en el bolsillo. ¡Muy recomendable!
                            </p>
                        </div>
                    </div>
                </div>

                {/* CARD 3: EQUIPO */}
                <div id="equipo" className="scroll-mt-25 w-full max-w-7xl bg-white rounded-4xl shadow-xl p-12 flex flex-col items-center gap-12">
                    <div className="text-center max-w-3xl">
                        <h2 className="text-4xl font-bold text-black mb-4 font-(--font-display)">
                            Nuestro equipo
                        </h2>
                        <p className=" text-black text-lg font-(--font-body)">
                            Los verdaderos creadores de Vesto.
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-12 w-full">

                        {/* Rodas */}
                        <div className="flex flex-col items-center text-center gap-2 w-32">
                            <div className="relative w-28 h-28 mb-2 group cursor-pointer">
                                <img src={RodasImg} alt="Rodas" className="absolute inset-0 w-28 h-28 rounded-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0 z-10" />
                                <img src="/img/black-logo.png" alt="Logo de Vesto" className="absolute inset-0 w-28 h-28 rounded-full object-contain bg-orange-500 p-3 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 z-0 shadow-inner" />
                            </div>
                            <h3 className="font-bold text-lg text-black font-(--font-body)">Rodas</h3>
                            <p className="text-sm text-blck font-(--font-body)">Cabra absoluta, no necesita presentación.</p>
                        </div>

                        {/* Gabino */}
                        <div className="flex flex-col items-center text-center gap-2 w-32">
                            <div className="relative w-28 h-28 mb-2 group cursor-pointer">
                                <img src={GabinoImg} alt="Gabino" className="absolute inset-0 w-28 h-28 rounded-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0 z-10" />
                                <img src="/img/black-logo.png" alt="Logo de Vesto" className="absolute inset-0 w-28 h-28 rounded-full object-contain bg-white p-3 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 z-0 shadow-inner" />
                            </div>
                            <h3 className="font-bold text-lg text-black font-(--font-body)">Pepe</h3>
                            <p className="text-sm text-blck font-(--font-body)">Aporta mucha veteranía, tiene más años que un bosque.</p>
                        </div>

                        {/* Gloria */}
                        <div className="flex flex-col items-center text-center gap-2 w-32">
                            <div className="relative w-28 h-28 mb-2 group cursor-pointer">
                                <img src={GloriajinImg} alt="Gloriajin" className="absolute inset-0 w-28 h-28 rounded-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0 z-10" />
                                <img src="/img/black-logo.png" alt="Logo de Vesto" className="absolute inset-0 w-28 h-28 rounded-full object-contain bg-orange-500 p-3 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 z-0 shadow-inner" />
                            </div>
                            <h3 className="font-bold text-lg text-black font-(--font-body)">Gloriajin</h3>
                            <p className="text-sm text-blck font-(--font-body)">Diva absoluta, le da el toque chick.</p>
                        </div>

                        {/* Miguel */}
                        <div className="flex flex-col items-center text-center gap-2 w-32">
                            <div className="relative w-28 h-28 mb-2 group cursor-pointer">
                                <img src={MiguelImg} alt="Miguel" className="absolute inset-0 w-28 h-28 rounded-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0 z-10" />
                                <img src="/img/black-logo.png" alt="Logo de Vesto" className="absolute inset-0 w-28 h-28 rounded-full object-contain bg-white p-3 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 z-0 shadow-inner" />
                            </div>
                            <h3 className="font-bold text-lg text-black font-(--font-body)">Miguel</h3>
                            <p className="text-sm text-blck font-(--font-body)">Obsesionado con el trabajo, dentro y fuera del campo.</p>
                        </div>

                        {/* Lucía */}
                        <div className="flex flex-col items-center text-center gap-2 w-32">
                            <div className="relative w-28 h-28 mb-2 group cursor-pointer">
                                <img src={LuciaImg} alt="Lucía" className="absolute inset-0 w-28 h-28 rounded-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0 z-10" />
                                <img src="/img/black-logo.png" alt="Logo de Vesto" className="absolute inset-0 w-28 h-28 rounded-full object-contain bg-orange-500 p-3 transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 z-0 shadow-inner" />
                            </div>
                            <h3 className="font-bold text-lg text-black font-(--font-body)">Lucía</h3>
                            <p className="text-sm text-blck font-(--font-body)">Sabe demasiado de todo, pero no lo dice, ¿falsa humilde?.</p>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}

