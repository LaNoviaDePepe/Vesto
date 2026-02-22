import Prenda from "./Prenda";
import type { PrendaProps } from "./Prenda";

interface ConjuntoProps {
    name: string;
    url: string;
    descripcion: string;
    prendas: PrendaProps[];
}

export default function Conjunto({ name, url, descripcion, prendas }: ConjuntoProps) {
    return (
        <div className="flex flex-col md:flex-row w-full gap-6 bg-primary-50 p-10 rounded-3xl">
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
