import FilterSelect from "./FilterSelect";
import * as CONSTANTES from '../../utils/constants'; // Ajusta la ruta según tu estructura
import { useFilterStore } from "../../stores/filterStore"; 


interface FilterProps {
    width: number;
}

export default function Filter({ width }: FilterProps) {

    const { setFilter } = useFilterStore();


    const handleSelectChange = (key: 'categoria' | 'temporada' | 'color', e: React.ChangeEvent<HTMLSelectElement>) => {
        const rawValue = e.target.value;       
        const cleanValue = rawValue === "quitar" ? "" : rawValue;

        setFilter(key, cleanValue);
    };

    return (
        <div className="bg-primary-50 flex justify-evenly items-center py-4 fixed top-0 z-50 mt-20"
            style={{ width: `${width}%` }}>
            
            {/* Recibe FilterSelects que se han formado en FilterSelect.tsx, los cuales
            inlcuyen eventos para saber qué filtros se han seleccionado  */}

            <FilterSelect 
                name="categoria" 
                placeholder="Elige una categoría" 
                options={CONSTANTES.CATEGORIA_PRENDA} 
                onChange={(e) => handleSelectChange('categoria', e)}
            />
            
            <FilterSelect 
                name="temporada" 
                placeholder="Elige una temporada" 
                options={CONSTANTES.TEMPORADA_PRENDA} 
                onChange={(e) => handleSelectChange('temporada', e)}
            />
            
            <FilterSelect 
                name="color" 
                placeholder="Elige un color" 
                options={CONSTANTES.COLOR_PRENDA} 
                onChange={(e) => handleSelectChange('color', e)}
            />
        </div>
    )
}
