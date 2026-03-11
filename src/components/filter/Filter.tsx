import FilterSelect from "./FilterSelect";
import * as CONSTANTES from '../../utils/constants'; // Ajusta la ruta según tu estructura

export interface FilterState {
    categoria: string;
    temporada: string;
    color: string;
    favorito: boolean; 
}

interface FilterProps {
    width: number;
    filters: FilterState;
    onFilterChange: (key: string, value: string | boolean) => void;
}

export default function Filter({ width, filters, onFilterChange }: FilterProps) {

    const handleSelectChange = (key: string, e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        const finalValue = selectedValue === "quitar" ? "" : selectedValue;
        
        onFilterChange(key, finalValue);
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
                value={filters.categoria}
                onChange={(e) => handleSelectChange('categoria', e)}
            />
            
            <FilterSelect 
                name="temporada" 
                placeholder="Elige una temporada" 
                options={CONSTANTES.TEMPORADA_PRENDA}
                value={filters.temporada}
                onChange={(e) => handleSelectChange('temporada', e)}
            />
            
            <FilterSelect 
                name="color" 
                placeholder={t('filter.choose_color')} 
                options={CONSTANTES.COLOR_PRENDA} 
                value={filters.color}
                onChange={(e) => handleSelectChange('color', e)}
            />

            {/* CHECKBOX FAVORITOS */}
            <div className="flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    id="fav-checkbox"
                    checked={filters.favorito}
                    onChange={(e) => onFilterChange('favorito', e.target.checked)}
                    className="w-5 h-5 cursor-pointer rounded"
                />
                <label 
                    htmlFor="fav-checkbox" 
                    className="flex items-center gap-1"
                >
                    Favoritos
                </label>
            </div>
        </div>
    )
}
