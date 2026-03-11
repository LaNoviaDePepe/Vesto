import { Heart, Trash2 } from "lucide-react";

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
    // Función para eliminar la prenda
    onDelete?: (id: number, url: string) => void;
    // Propiedad para ocultar el botón de borrar en vista OutfitsPage
    hideDelete?: boolean;
}

export default function Prenda({ 
    id, name, url, color, temporada, categoria, 
    favorito, onToggleFavorito, hideHeart, 
    onDelete, hideDelete }: PrendaProps) {

    // función para manejar el click en el corazón
    const handleHeartClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // evita que se haga click en la tarjeta entera, solo se hace click en el corazón
        if (onToggleFavorito && id !== undefined) {
            onToggleFavorito(id, favorito);
        }
    };

    // función para manejar el click en la papelera
    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation(); 
        if (onDelete && id !== undefined) {
            onDelete(id, url);
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

            {/* Renderiza la papelera solo si pasamos la función onDelete y no está oculto */}
            {!hideDelete && onDelete && (
                <button
                    onClick={handleDeleteClick}
                    className="absolute top-4 left-4 z-10 bg-white/70 p-1.5 rounded-full shadow-sm hover:scale-110 hover:bg-red-50 transition-all cursor-pointer text-red-500"
                    title="Eliminar prenda"
                >
                    <Trash2 size={22} />
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