import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react"; // Optional: install lucide-react for icons

type FilterSelectOption = {
    value: string;
    label: string;
};

interface FilterSelectProps {
    name: string;
    options: FilterSelectOption[];
    placeholder: string;
    value: string;
    onChange: (name: string, value: string) => void;
}

export default function FilterSelect({ name, options, placeholder, value, onChange }: FilterSelectProps) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;

    return (
        <div className="relative w-full min-w-[150px]" ref={dropdownRef}>

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between w-full px-3 py-2 text-left bg-transparent border-b border-gray-300 focus:outline-none ${value === "" ? "text-gray-400" : "text-black"
                    }`}
            >
                <span className="truncate">{t(selectedLabel as any)}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <ul className="absolute left-0 right-0 z-50 mt-2 p-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto flex flex-col gap-1">

                    <li
                        onClick={() => { onChange(name, ""); setIsOpen(false); }}
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100 rounded text-gray-400 text-sm"
                    >
                        {placeholder}
                    </li>

                    {options.map((option) => (
                        <li
                            key={option.value}
                            onClick={() => {
                                onChange(name, option.value);
                                setIsOpen(false);
                            }}
                            className={`px-3 py-2 cursor-pointer rounded transition-colors ${value === option.value ? "bg-primary-100 text-primary-900" : "hover:bg-gray-100 text-black"
                                }`}
                        >
                            {t(option.label as any)}
                        </li>
                    ))}

                    <li
                        onClick={() => { onChange(name, ""); setIsOpen(false); }}
                        className="mt-1 border-t pt-1 px-3 py-2 cursor-pointer hover:bg-red-50 text-red-600 flex justify-between items-center"
                    >
                        {t('filter.remove')} ❌
                    </li>
                </ul>
            )}
        </div>
    );
}