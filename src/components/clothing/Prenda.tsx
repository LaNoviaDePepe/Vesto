export interface PrendaProps {
    name: string;
    url: string;
    color: string;
    temporada: string;
}

export default function Prenda({ name, url, color, temporada }: PrendaProps) {
    return (
        <div className="w-[238px] h-[362px] p-[7px] m-[10px] rounded-[10px] bg-[var(--color-white)] flex flex-col items-center">
            <img
                src={url}
                alt={name}
                title={`${color} - ${temporada}`}
                className=" rounded-[10px] object-cover"
            />
            <span className="mt-[5px] text-center">{name}</span>
        </div>
    );
}