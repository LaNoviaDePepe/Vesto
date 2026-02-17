import Prenda from "../components/clothing/Prenda.tsx";

interface PrendasLayoutProps {
    prendas: {
        name: string;
        url: string;
        color: string;
        temporada: string;
        categoria: string;
    }[];
}

export default function PrendasLayout({ prendas }: PrendasLayoutProps) {
    return (
        <div className="flex flex-wrap justify-center gap-x-12.5 gap-y-12.5 container p-10">
            {prendas.map((prenda, index) => (
                <Prenda
                    key={index}
                    name={prenda.name}
                    url={prenda.url}
                    color={prenda.color}
                    temporada={prenda.temporada}
                    categoria={prenda.categoria}
                />
            ))}
        </div>
    );
}