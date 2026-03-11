
import Prenda from "../components/clothing/Prenda.tsx";
import type { PrendaProps } from "../components/clothing/Prenda.tsx"; // Importamos la interfaz ya hecha

interface PrendasLayoutProps {
    prendas: PrendaProps[]; // Usamos la interfaz existente en vez de redefinirla
    onToggleFavorito?: (id: number, estadoActual: boolean) => void;
    onDelete?: (id: number, url: string) => void;
}

export default function PrendasLayout({ prendas, onToggleFavorito, onDelete }: PrendasLayoutProps) {
    return (
        <div className="flex flex-wrap justify-center gap-x-12.5 gap-y-12.5 container p-10">
            {prendas.map((prenda) => (
                // Spread operator: Pasa todas las props de golpe en vez de una a una
                <Prenda 
                key={prenda.id} {...prenda} //Antes la key era {index}, pero al ser posible borrar los elementos, podría dar fallos de reasignación
                onToggleFavorito={onToggleFavorito}
                onDelete={onDelete} />
            ))}
        </div>
    );
}


// CÓDIGO ANTERIOR:

// import Prenda from "../components/clothing/Prenda.tsx";

// interface PrendasLayoutProps {
//     prendas: {
//         name: string;
//         url: string;
//         color: string;
//         temporada: string;
//         categoria: string;
//         favorito: boolean;
//     }[];
// }

// export default function PrendasLayout({ prendas }: PrendasLayoutProps) {
//     return (
//         <div className="flex flex-wrap justify-center gap-x-12.5 gap-y-12.5 container p-10">
//             {prendas.map((prenda, index) => (
//                 <Prenda
//                     key={index}
//                     name={prenda.name}
//                     url={prenda.url}
//                     color={prenda.color}
//                     temporada={prenda.temporada}
//                     categoria={prenda.categoria} 
//                     favorito={prenda.favorito}                />
//             ))}
//         </div>
//     );
// }