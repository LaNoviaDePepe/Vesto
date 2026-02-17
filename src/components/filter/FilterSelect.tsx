import { useState, type SelectHTMLAttributes } from "react";


type FilterSelectOption = {
    value: string;
    label: string;
};
interface FilterSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    name: string;
    options: FilterSelectOption[];
    placeholder: string;
    disabled?: boolean;

}

export default function FilterSelect({ name, options, placeholder, disabled, onChange }: FilterSelectProps) {

    const [value, setValue] = useState("");


    const baseClasses =
        "w-full bg-transparent border-none outline-none appearance-none";

    const isPlaceholder = value === "";

    return (
        <div className="flex flex-col">
            <select
                name={name}
                disabled={disabled}
                value={value}
                // Si 'isPlaceholder' es true (value está vacío), el texto es gris.
                // Si hay un valor seleccionado, el texto es negro.
                className={`${baseClasses} ${isPlaceholder ? "text-gray-400" : "text-black"}`}

                // Este onChange refiere al evento REAL del navegador (el click del usuario)
                onChange={(e) => {
                    const selected = e.target.value; // Guarda la opción seleccionada
                    if (selected === "quitar") {
                        // Si elige la opción "Quitar ❌",
                        // forzamos el estado a "" (vacío).
                        // Esto hace que el select vuelva a mostrar el Placeholder gris ("Elige un color").
                        setValue(""); 
                    } else {
                        //Si es otra, cambia el estado para que el texto sea negro
                        setValue(selected);
                    }

                    // Sea cual sea la opción, incluirá este otro onChange que nos llega por parámetros
                    // y le pasamos el evento 'e' a Filter.tsx sepa qué filtrar (ej: mostrar solo partes de arriba).
                    if (onChange) {
                        onChange(e);
                    }
                }}
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
                    Quitar ❌
                </option>
            </select>
        </div>
    );
}
