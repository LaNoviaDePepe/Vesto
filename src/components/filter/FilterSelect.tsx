import { useState } from "react";


type FilterOption = {
    value: string;
    label: string;
};
interface FilterProps {
    name: string;
    options: FilterOption[];
    placeholder: string;
    disabled?: boolean;
}

export default function Filter({ name, options, placeholder, disabled }: FilterProps) {

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
                className={`${baseClasses} ${isPlaceholder ? "text-gray-400" : "text-black"}`}
                onChange={(e) => {
                    const selected = e.target.value;
                    if (selected === "quitar") {
                        setValue(""); // reset to placeholder
                    } else {
                        setValue(selected);
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
