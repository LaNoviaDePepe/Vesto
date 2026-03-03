import { Heart } from "lucide-react";

/**
 * Interfaz que define las propiedades que recibe el componente Prenda.
 * Contiene toda la información necesaria para mostrar una pieza de ropa individual.
 */
export interface PrendaProps {
    id?: number;
    id_usuario?: string;
    name: string;
    url: string;
    color: string;
    temporada: string;
    categoria: string;
    favorito: boolean;
    /**
     * Función callback para alternar el estado de favorito.
     * @param id - El identificador único de la prenda.
     * @param estadoActual - El estado actual de favorito antes de ser clicado.
     */
    onToggleFavorito?: (id: number, estadoActual: boolean) => void;
    /** Bandera (flag) que permite ocultar el botón del corazón.
     * Muy útil al reutilizar el componente en vistas donde no se requiere esta acción (ej. OutfitsPage).
     */
    hideHeart?: boolean;
}

/**
 * Componente que renderiza una tarjeta individual ("Card") para una prenda de ropa.
 * Muestra la imagen, el nombre y un botón condicional para marcar/desmarcar como favorita.
 */
export default function Prenda({ id, name, url, color, temporada, categoria, favorito, onToggleFavorito, hideHeart }: PrendaProps) {

    /**
     * Maneja el evento de clic específicamente sobre el icono del corazón.
     * @param e - Evento sintético del ratón de React.
     */
    const handleHeartClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // evita que se haga click en la tarjeta entera, solo se hace click en el corazón
        if (onToggleFavorito && id !== undefined) {
            onToggleFavorito(id, favorito);
        }
    };

    return (
        <div className="relative w-59.5 h-70 p-1.75 m-2.5 rounded-[10px] bg-white flex flex-col items-center">

            {/* Solo renderiza el corazón si nos interesa */}
            {!hideHeart && (
                <button
                    onClick={handleHeartClick}
                    className="absolute top-4 right-4 z-10 bg-white/70 p-1.5 rounded-full shadow-sm hover:scale-110 transition-transform cursor-pointer"
                >
                    <Heart
                        size={22}
                        className={favorito ? "text-red-500 fill-red-500" : "text-gray-500"}
                    />
                </button>
            )}
            <img
                src={url}
                alt={name}
                title={`${color} - ${temporada} - ${categoria}`}
                className=" rounded-[10px] object-cover h-60 w-80"
            />
            <span className="mt-1.25 text-center">{name}</span>
        </div>
    );
}