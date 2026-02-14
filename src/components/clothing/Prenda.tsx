export interface PrendaProps {
    name: string;
    url: string;
    color: string;
    temporada: string;
}

export default function Prenda({ name, url, color, temporada }: PrendaProps) {
    return (
        <div className="w-59.5 h-70 p-1.75 m-2.5 rounded-[10px] bg-white flex flex-col items-center">
            <img
                src={url}
                alt={name}
                title={`${color} - ${temporada}`}
                className=" rounded-[10px] object-cover h-60 w-80"
            />
            <span className="mt-1.25 text-center">{name}</span>
        </div>
    );
}