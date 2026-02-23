import { Heart } from "lucide-react";

export interface PrendaProps {
    id?: number;
    id_usuario?: string;
    name: string;
    url: string;
    color: string;
    temporada: string;
    categoria: string;
    favorito: boolean;
    //Función para marcar/desmarcar favorita una prenda
    onToggleFavorito?: (id: number, estadoActual: boolean) => void;
    //Propiedad que nos permite eliminar el corazón de la vista OutfitsPage
    hideHeart?: boolean;
}

export default function Prenda({ id, name, url, color, temporada, categoria, favorito, onToggleFavorito, hideHeart }: PrendaProps) {

    // función para manejar el click en el corazón
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