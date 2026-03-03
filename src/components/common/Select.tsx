import type { ChangeEvent, FocusEvent } from "react";

/**
 * Define la estructura de cada opción individual dentro del desplegable.
 */
type FilterOption = {
    value: string;
    label: string;
};

/**
 * Propiedades esperadas para el componente Select personalizado.
 */
interface SelectProps {
    name: string;
    value: string;
    options: FilterOption[];
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    onBlur?: (e: FocusEvent<HTMLSelectElement>) => void;
}

/**
 * Componente de interfaz (UI) reutilizable para menús desplegables (<select>).
 * Incluye estilos personalizados de Tailwind, soporte para estados de error y una
 * flecha (caret) SVG personalizada para unificar el diseño en todos los navegadores.
 */
export default function Select({
    name,
    value,      
    options,
    placeholder,
    error,
    disabled,
    onChange,  
    onBlur      
}: SelectProps) {

    const baseClasses = 'w-full rounded-md border px-4 py-3 outline-none transition-colors appearance-none bg-white';

    const borderClasses = error
        ? 'border-[var(--color-danger-600)]' 
        : 'border-gray-300 focus:border-[var(--color-auxiliary-700)]'; 

    const textClasses = value === ""
        ? 'text-gray-400'  
        : 'text-gray-900'; 

    return (
        <div className="flex flex-col gap-1 w-full">
            <div className="relative">
                <select
                    name={name}
                    value={value}        
                    disabled={disabled}
                    onChange={onChange}   
                    onBlur={onBlur}       
                    className={`${baseClasses} ${borderClasses} ${textClasses}`}
                >
                    <option value="" disabled className="text-gray-400">
                        {placeholder}
                    </option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value} className="text-gray-900">
                            {option.label}
                        </option>
                    ))}
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                </div>
            </div>

            {error && (
                <span className="text-sm text-danger-600">
                    {error}
                </span>
            )}
        </div>
    );
}