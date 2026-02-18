import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import Button from '../components/common/Button';
import { useTranslation } from "react-i18next";

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

    return (

        <main className="w-full bg-auxiliary-50">

            {/* --- SECCIÓN 1: HERO --- */}
            <section className="min-h-screen w-full bg-linear-to-br from-auxiliary-700 to-auxiliary-50 flex items-center justify-center font-sans px-32 py-12">

                <div className="max-w-7xl w-full grid grid-cols-2 gap-16 items-center">

                    <div className="flex flex-col items-start gap-8">

                        <div className="logo">
                            <Link to="/">
                                <img
                                    src="/img/black-logo.png"
                                    alt="Logo de Vesto"
                                    className="h-64 w-auto object-contain"
                                />
                            </Link>
                        </div>

                        <p className="font-(--font-display) text-4xl uppercase text-black max-w-xl">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        </p>

                        <div className="flex gap-4 mt-6 w-auto">
                            <Link to="/login"><Button variant='primary'>Iniciar sesión</Button></Link>
                            <Link to="/signup"><Button variant='auxiliar'>Registro</Button></Link>
                        </div>
                    </div>

                    <div className="flex justify-end items-center h-full">
                        <img
                            src="/img/walking-man.png"
                            alt="Ilustración persona caminando"
                            className="w-full max-w-md object-contain"
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
                            Duis in convallis libero, ac accumsan lectus. Duis nec diam massa. Sed ornare libero enim, et faucibus nunc dictum id.
                        </p>
                    </div>
                    <div className="relative w-full rounded-xl overflow-hidden">
                        <img
                            src="/img/video-default.png"
                            alt="Preview del video"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* CARD 2: RECOMENDACIONES */}
                <div id="reviews" className="scroll-mt-25 w-full max-w-7xl bg-white rounded-4xl shadow-xl p-12 flex flex-col items-center gap-12">
                    <h2 className="text-4xl font-bold text-black text-center font-(--font-display)">
                        +50K usuarios nos recomiendan
                    </h2>
                    <div className="grid grid-cols-4 gap-8 w-full">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="flex flex-col items-center text-center gap-2">
                                {/* Avatar usuario */}
                                <img
                                    src="/img/opinions-default.png"
                                    alt="Usuario"
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                                <h3 className="font-bold text-lg text-black font-(--font-body)">Usuario</h3>
                                {/* Estrellas */}
                                <img
                                    src="/img/stars.png"
                                    alt="5 estrellas"
                                    className="h-5 w-auto"
                                />
                                <p className="text-sm text-black px-2 font-(--font-body)">
                                    Duis nec diam massa. Sed ornare libero enim.
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CARD 3: EQUIPO */}
                <div id="equipo" className="scroll-mt-25 w-full max-w-7xl bg-white rounded-4xl shadow-xl p-12 flex flex-col items-center gap-12">
                    <div className="text-center max-w-3xl">
                        <h2 className="text-4xl font-bold text-black mb-4 font-(--font-display)">
                            Nuestro equipo
                        </h2>
                        <p className=" text-black text-lg font-(--font-body)">
                            Duis in convallis libero, ac accumsan lectus. Duis nec diam massa.
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-12 w-full">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div key={item} className="flex flex-col items-center text-center gap-2 w-32">
                                {/* Avatar del equipo */}
                                <img
                                    src="/img/equipo-default.png"
                                    alt="Miembro del equipo"
                                    className="w-28 h-28 rounded-full object-cover mb-2"
                                />
                                <h3 className="font-bold text-lg text-black font-(--font-body)">Nombre</h3>
                                <p className="text-sm text-blck font-(--font-body)">Duis nec diam massa.</p>
                            </div>
                        ))}
                    </div>
                </div>

            </section>

        </main>
    );
}

