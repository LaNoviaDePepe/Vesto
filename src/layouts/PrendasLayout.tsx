import Prenda from "../components/clothing/Prenda.tsx";

interface PrendasLayoutProps {
    prendas: {
        name: string;
        url: string;
        color: string;
        temporada: string;
    }[];
}

export default function PrendasLayout({ prendas }: PrendasLayoutProps) {
    return (
        <div className="flex flex-wrap justify-center gap-x-[50px] gap-y-[50px]">
            {prendas.map((prenda, index) => (
                <Prenda
                    key={index}
                    name={prenda.name}
                    url={prenda.url}
                    color={prenda.color}
                    temporada={prenda.temporada}
                />
            ))}
        </div>
    );
}