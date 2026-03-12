import { Heart, Trash2 } from "lucide-react";
import type { PrendaProps } from "./Prenda";
import { OutfitSlot } from "./OutfitSlot";
import { useTranslation } from "react-i18next";

interface ConjuntoProps {
    id?: number;
    nombre: string;
    url_imagen: string;
    descripcion: string;
    prendas: PrendaProps[];
    favorito: boolean;
    //Función para marcar/desmarcar favorita una prenda
    toggleFavorito?: (id: number, estadoActual: boolean) => void;
    onDelete?: (id: number, url: string) => void;
}

export default function Conjunto({ id, nombre, url_imagen, descripcion, prendas, favorito, toggleFavorito, onDelete }: ConjuntoProps) {
    const { t } = useTranslation();

    // Función para encontrar la prenda por categoría.
    // Al recibir PrendaProps[], TypeScript sabe qué propiedades tiene cada objeto.
    const getPrendaByCategoria = (cat: string): PrendaProps | null => {
        return prendas.find(p => p.categoria === cat) || null;
    };

    // función para manejar el click en el corazón
    const handleHeartClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // evita que se haga click en la tarjeta entera, solo se hace click en el corazón
        if (toggleFavorito && id !== undefined) {
            toggleFavorito(id, favorito);
        }
    };
    // función para manejar el click en la papelera
    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete && id !== undefined) {
            onDelete(id, url_imagen);
        }
    };

    return (
        <div className="relative flex flex-col md:flex-row w-full gap-6 bg-primary-50 pt-14 p-6 md:p-10 rounded-3xl">

            {/* Contenedor de Acciones (Agrupa botones a la derecha) */}
            <div className="absolute top-4 right-4 z-10 flex gap-3">
                {/* Papelera */}
                {onDelete && (
                    <button
                        onClick={handleDeleteClick}
                        className="bg-white/70 p-1.5 rounded-full shadow-sm hover:scale-110 hover:bg-red-50 transition-all cursor-pointer text-red-500"
                        title={t('outfit.delete_outfit_title')}
                    >
                        <Trash2 size={22} />
                    </button>
                )}

                {/* Corazón */}
                {toggleFavorito && (
                    <button
                        onClick={handleHeartClick}
                        className="bg-white/70 p-1.5 rounded-full shadow-sm hover:scale-110 transition-transform cursor-pointer"
                        title={t('outfit.mark_favorite_title')}
                    >
                        <Heart
                            size={22}
                            className={favorito ? "text-red-500 fill-red-500" : "text-gray-500"}
                        />
                    </button>
                )}
            </div>


            {/* Columna Izquierda: Información y Foto Principal */}
            <div className="w-full md:w-[30%] flex flex-col gap-4">
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

            {/* Columna Derecha: grid de prendas */}
            <div className="w-full md:w-[70%] flex flex-col gap-6 justify-center bg-white/30 rounded-2xl p-6 border border-white/50">

                {/* Fila Superior: Cabeza, Parte Arriba, Complemento (móvil: columna única) */}
                <div className="flex flex-col md:flex-row justify-center gap-4 lg:gap-8 w-full">
                    <OutfitSlot label={t('outfit.head')} item={getPrendaByCategoria("cabeza")} />
                    <OutfitSlot label={t('outfit.top')} item={getPrendaByCategoria("parte_arriba")} />
                    <OutfitSlot label={t('outfit.accessory')} item={getPrendaByCategoria("complemento")} />
                </div>

                {/* Fila Inferior: Parte Abajo, Calzado (móvil: columna única) */}
                <div className="flex flex-col md:flex-row justify-center gap-4 lg:gap-8 w-full">
                    <OutfitSlot label={t('outfit.bottom')} item={getPrendaByCategoria("parte_abajo")} />
                    <OutfitSlot label={t('outfit.shoes')} item={getPrendaByCategoria("calzado")} />
                </div>
            </div>
        </div>
    );
}
