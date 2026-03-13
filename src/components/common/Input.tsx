import React, { useState } from "react";

/**
 * Propiedades del componente Input.
 * @interface InputProps
 * @extends {React.InputHTMLAttributes<HTMLInputElement>}
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    /** Etiqueta opcional que describe el campo. */
    label?: string;
    /** Mensaje de error a mostrar debajo del campo. */
    error?: string;
}

/**
 * Componente `Input` reutilizable y adaptado al Modo Oscuro.
 * Soporta inputs de texto, contraseñas (con botón de revelado) y checkboxes.
 * * @param {InputProps} props - Las propiedades del input.
 * @returns {JSX.Element} Campo de formulario estilizado.
 */
export default function Input({ label, error, disabled, type, ...props }: InputProps) {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = type === "password" && showPassword ? "text" : type;
    const isCheckbox = type === "checkbox";

    const baseClasses = isCheckbox
        ? "w-4 h-4 cursor-pointer accent-primary-600"
        : "w-full rounded-md border px-4 py-3 outline-none transition-all font-body duration-300";

    const borderClasses = !isCheckbox && error
        ? "border-danger-600 focus:ring-1 focus:ring-danger-600 bg-white dark:bg-gray-900"
        : disabled
            ? "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
            : !isCheckbox
                ? "border-gray-300 dark:border-gray-700 focus:border-auxiliary-700 dark:focus:border-primary-500 focus:ring-1 focus:ring-auxiliary-700 dark:focus:ring-primary-500 bg-white dark:bg-gray-900"
                : ""; 

    const textClasses = disabled ? "text-gray-400 dark:text-gray-600" : "text-black dark:text-white";

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className={`flex ${isCheckbox ? "flex-row items-center gap-3" : "flex-col gap-2"}`}>
                {isCheckbox && (
                    <input type="checkbox" className={`${baseClasses} ${borderClasses}`} disabled={disabled} {...props} />
                )}
                {label && (
                    <label className="text-sm font-normal text-gray-700 dark:text-gray-300 transition-colors duration-300">
                        {label} {props.required && <span className="text-danger-600">*</span>}
                    </label>
                )}
                {!isCheckbox && (
                    <div className="relative group w-full">
                        <input
                            type={inputType}
                            className={`${baseClasses} ${borderClasses} ${textClasses} placeholder:text-gray-300 dark:placeholder:text-gray-600 shadow-sm transition-colors duration-300`}
                            disabled={disabled}
                            {...props}
                        />
                        {type === "password" && (
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-700 dark:text-primary-400 hover:text-primary-600 transition-colors"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                )}
                            </button>
                        )}
                    </div>
                )}
            </div>
            {error && <span className="text-xs font-medium text-danger-600 dark:text-red-400 px-1">{error}</span>}
        </div>
    );
}