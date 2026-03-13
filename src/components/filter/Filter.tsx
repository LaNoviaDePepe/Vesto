import FilterSelect from "./FilterSelect";
import * as CONSTANTES from '../../utils/constants';
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();

    const handleValueChange = (name: string, value: string) => {
        onFilterChange(name, value);
    };

    return (
        <div 
            className="bg-primary-50 fixed top-20 left-1/2 -translate-x-1/2 z-40 px-4 py-3 shadow-sm border-b border-primary-100"
            style={{ width: width ? `${width}%` : '100%', maxWidth: '100%' }}
        >
            <div className="mx-auto flex flex-wrap items-center justify-center gap-4 sm:justify-evenly sm:flex-nowrap">

                <div className="flex-1 min-w-[140px]">
                    <FilterSelect
                        name="categoria"
                        placeholder={t('filter.choose_category')}
                        options={CONSTANTES.CATEGORIA_PRENDA}
                        value={filters.categoria}
                        onChange={handleValueChange}
                    />
                </div>

                <div className="flex-1 min-w-[140px]">
                    <FilterSelect
                        name="temporada"
                        placeholder={t('filter.choose_season')}
                        options={CONSTANTES.TEMPORADA_PRENDA}
                        value={filters.temporada}
                        onChange={handleValueChange}
                    />
                </div>

                <div className="flex-1 min-w-[140px]">
                    <FilterSelect
                        name="color"
                        placeholder={t('filter.choose_color')}
                        options={CONSTANTES.COLOR_PRENDA}
                        value={filters.color}
                        onChange={handleValueChange}
                    />
                </div>

                <div className="flex items-center gap-2 cursor-pointer whitespace-nowrap px-2">
                    <input
                        type="checkbox"
                        id="fav-checkbox"
                        checked={filters.favorito}
                        onChange={(e) => onFilterChange('favorito', e.target.checked)}
                        className="w-5 h-5 cursor-pointer rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label
                        htmlFor="fav-checkbox"
                        className="flex items-center gap-1 cursor-pointer font-medium text-sm text-gray-700 select-none"
                    >
                        {t('filter.favorites')}
                    </label>
                </div>
            </div>
        </div>
    );
}