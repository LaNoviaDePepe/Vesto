import { useEffect, useRef, useState } from 'react';

export function useInView(threshold = 0.15) {
    // threshold: porcentaje de visibilidad para disparar la animación (0.15 = 15%)

    // ref: referencia al elemento del DOM que queremos vigilar
    const ref = useRef<HTMLDivElement>(null);

    // inView: estado booleano — false = no visible aún, true = ya entró en pantalla
    const [inView, setInView] = useState(false);

    useEffect(() => {

        // Creamos el "vigilante" que observa si el elemento entra en el viewport
        const observer = new IntersectionObserver(
            ([entry]) => {
                // entry.isIntersecting = true cuando el elemento es visible
                // según el threshold definido
                if (entry.isIntersecting) {
                    setInView(true);      // Marcamos como visible → dispara la animación CSS
                    observer.disconnect(); // Dejamos de vigilar: la animación solo ocurre una vez
                }
            },
            { threshold } // Le pasamos el 0.15 (o lo que reciba el hook)
        );

        // Le decimos al observer qué elemento tiene que vigilar
        // (el div al que le pongamos ref={ref} en el componente)
        if (ref.current) observer.observe(ref.current);

        // Cleanup: si el componente se desmonta, dejamos de observar
        return () => observer.disconnect();

    }, []); // [] = solo se ejecuta al montar el componente, no en cada render

    // Devolvemos los dos valores que necesita el componente:
    // - ref: para pegárselo al elemento HTML con ref={ref}
    // - inView: para saber si aplicar o no la clase de animación
    return { ref, inView };
}

