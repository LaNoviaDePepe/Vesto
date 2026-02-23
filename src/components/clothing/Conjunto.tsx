import { Heart } from "lucide-react";
import Prenda from "./Prenda";
import type { PrendaProps } from "./Prenda";

interface ConjuntoProps {
    id?: number;
    name: string;
    url: string;
    descripcion: string;
    prendas: PrendaProps[];
    favorito: boolean;
    //Función para marcar/desmarcar favorita una prenda
    onToggleFavorito?: (id: number, estadoActual: boolean) => void;
}

export default function Conjunto({ id, name, url, descripcion, prendas, favorito, onToggleFavorito }: ConjuntoProps) {

    // función para manejar el click en el corazón
    const handleHeartClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // evita que se haga click en la tarjeta entera, solo se hace click en el corazón
        if (onToggleFavorito && id !== undefined) {
            onToggleFavorito(id, favorito);
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

            <div className="w-full md:w-1/3 bg-white p-4 rounded-[10px] self-start">
                <img
                    src={url}
                    alt={name}
                    className="w-full h-auto object-cover rounded-[10px] block"
                />
            </div>
            <div className="w-full md:w-2/3 flex flex-col gap-4">
                <h2 className="text-xl font-bold">{name}</h2>
                <p className="text-gray-700">{descripcion}</p>
                <div className="flex flex-wrap justify-center gap-x-12.5 gap-y-12.5">
                    {prendas.map((prenda, index) => (
                        // Spread operator, en vez de pasar uno a uno, además escondemos los corazones
                        <Prenda key={index} {...prenda} hideHeart={true} />
                    ))}
                </div>
                {/* CÓDIGO ANTERIOR: */}
                {/* <div className="flex flex-wrap justify-center gap-x-12.5 gap-y-12.5">
                    {prendas.map((prenda, index) => (
                        <Prenda
                            key={index}
                            name={prenda.name}
                            url={prenda.url}
                            color={prenda.color}
                            temporada={prenda.temporada}
                            categoria={prenda.categoria}
                            favorito={prenda.favorito}                        
                        />
                    ))}
                </div> */}
            </div>
        </div>
    );
}
