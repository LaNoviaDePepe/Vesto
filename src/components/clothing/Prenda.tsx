// import { Heart } from "lucide-react";

export interface PrendaProps {
    id?: number; 
    id_usuario?: string; 
    name: string;
    url: string;
    color: string;
    temporada: string;
    categoria: string;
    favorito: boolean;
}

export default function Prenda({ name: name, url: url, color, temporada, categoria, favorito}: PrendaProps) {
    return (
        <div className="w-59.5 h-70 p-1.75 m-2.5 rounded-[10px] bg-white flex flex-col items-center">
            {/* Div icono
            <div className="absolute top-4 right-4 z-10 bg-white/70 p-1.5 rounded-full backdrop-blur-sm shadow-sm">
                <Heart 
                    size={22} 
                    // Si es favorito -> rojo y relleno. Si no -> gris y vacío.
                    className={favorito ? "text-red-500 fill-red-500" : "text-gray-500"} 
                />
            </div> */}
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