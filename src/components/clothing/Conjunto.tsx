import { Heart } from "lucide-react";
import type { PrendaProps } from "./Prenda";
import { OutfitSlot } from "./OutfitSlot";

/**
 * Propiedades esperadas para el componente Conjunto.
 */
interface ConjuntoProps {
    id?: number;
    nombre: string;
    url_imagen: string;
    descripcion: string;
    prendas: PrendaProps[];
    favorito: boolean;
    /**
     * Función callback para alternar el estado de favorito.
     * @param id - El identificador del conjunto.
     * @param estadoActual - El estado actual de favorito antes del cambio.
     */
    toggleFavorito?: (id: number, estadoActual: boolean) => void;
}

/**
 * Componente que renderiza una tarjeta de un conjunto (outfit), mostrando su imagen principal,
 * descripción, un botón de favorito y una cuadrícula con las prendas individuales categorizadas.
 */
export default function Conjunto({ id, nombre, url_imagen, descripcion, prendas, favorito, toggleFavorito }: ConjuntoProps) {


    /**
     * Busca y devuelve la primera prenda del conjunto que coincida con la categoría dada.
     * @param cat - El string que define la categoría a buscar (ej: "cabeza", "calzado").
     * @returns El objeto de la prenda si se encuentra, de lo contrario `null`.
     */
    const getPrendaByCategoria = (cat: string): PrendaProps | null => {
        return prendas.find(p => p.categoria === cat) || null;
    };

    /**
     * Manejador del evento click en el botón de "Favorito" (Corazón).
     * Intercepta el evento para evitar la propagación y ejecuta la función callback `toggleFavorito`.
     * @param e - El evento sintético de ratón de React.
     */
    const handleHeartClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // evita que se haga click en la tarjeta entera, solo se hace click en el corazón
        if (toggleFavorito && id !== undefined) {
            toggleFavorito(id, favorito);
        }
    };

    return (
        <div className="relative flex flex-col md:flex-row w-full gap-6 bg-primary-50 p-10 rounded-3xl">
            {/* Corazón */}
            <button
                onClick={handleHeartClick}
                className="absolute top-4 right-4 z-10 bg-white/70 p-1.5 rounded-full shadow-sm hover:scale-110 transition-transform cursor-pointer"
            >
                <Heart
                    size={22}
                    className={favorito ? "text-red-500 fill-red-500" : "text-gray-500"}
                />
            </button>

            {/* Columna Izquierda: Información y Foto Principal */}
            <div className="w-full md:w-72 flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-primary-900 leading-tight">{nombre}</h2>
                {/* Ratio predeterminado para que las fotos tengan un display homogéneo. */}
                <div className="w-full aspect-3/4 bg-white p-3 rounded-2xl shadow-sm border border-primary-200">
                    <img
                        src={url_imagen}
                        alt={nombre}
                        className="w-full h-full object-cover rounded-xl"
                    />
                </div>
                <p className="text-gray-600 text-sm italic leading-relaxed">{descripcion}</p>
            </div>

            {/* Columna Derecha: grid" de prendas*/}
            <div className="flex-1 flex flex-col gap-6 justify-center bg-white/30 rounded-2xl p-6 m-7 border border-white/50">

                {/* Fila Superior: Cabeza, Parte Arriba, Complemento */}
                <div className="flex justify-center gap-4 lg:gap-8 w-full">
                    <OutfitSlot label="Cabeza" item={getPrendaByCategoria("cabeza")} />
                    <OutfitSlot label="Parte Arriba" item={getPrendaByCategoria("parte_arriba")} />
                    <OutfitSlot label="Complemento" item={getPrendaByCategoria("complemento")} />
                </div>

                {/* Fila Inferior: Parte Abajo, Calzado */}
                <div className="flex justify-center gap-4 lg:gap-8 w-full">
                    <OutfitSlot label="Parte Abajo" item={getPrendaByCategoria("parte_abajo")} />
                    <OutfitSlot label="Calzado" item={getPrendaByCategoria("calzado")} />
                </div>
            </div>
        </div>
    );
}

