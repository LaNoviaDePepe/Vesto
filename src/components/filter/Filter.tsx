import FilterSelect from "./FilterSelect";
import * as CONSTANTES from '../../utils/constants';

interface FilterProps {
    width: number;
}

export default function Filter({ width }: FilterProps) {
    return (
        <div className=" bg-primary-50 flex justify-evenly items-center py-4 fixed top-0 z-50 mt-20"
            style={{ width: `${width}%` }}>
            <FilterSelect name="categoria" placeholder="Elige una categoría" options={CONSTANTES.CATEGORIA_PRENDA} />
            <FilterSelect name="temporada" placeholder="Elige una temporada" options={CONSTANTES.TEMPORADA_PRENDA} />
            <FilterSelect name="color" placeholder="Elige un color" options={CONSTANTES.COLOR_PRENDA} />
        </div>
    )
}