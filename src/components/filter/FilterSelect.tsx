import type { SelectHTMLAttributes } from "react";


type FilterSelectOption = {
    value: string;
    label: string;
};

interface FilterSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    name: string;
    options: FilterSelectOption[];
    placeholder: string;
    value: string; 
    disabled?: boolean;

}

export default function FilterSelect({ name, options, placeholder, disabled, value, onChange }: FilterSelectProps) {

    const baseClasses =
        "w-full bg-transparent border-none outline-none appearance-none";

    const isPlaceholder = value === "";

    return (
        <div className="flex flex-col">
            <select
                name={name}
                disabled={disabled}
                value={value}
                // CUANDO CAMBIA, LE PASAMOS EL EVENTO DIRECTAMENTE AL PADRE
                // El padre ya se encarga de saber si es "quitar" u otra opción
                onChange={onChange} 
                // Si 'isPlaceholder' es true (value está vacío), el texto es gris.
                // Si hay un valor seleccionado, el texto es negro.
                className={`${baseClasses} ${isPlaceholder ? "text-gray-400" : "text-black"}`}

            >
                <option value="" disabled className="bg-primary-50 text-gray-400">
                    {placeholder}
                </option>

                {options.map((option) => (
                    <option key={option.value} value={option.value} className="bg-primary-50 text-black">
                        {option.label}
                    </option>
                ))}

                <option value="quitar" className="bg-primary-50 text-black">
                    {t('filter.remove')} ❌
                </option>
            </select>
        </div>
    );
}
