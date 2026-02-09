import React, { useState } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export default function Input({ label, error, disabled, type, ...props }: InputProps) {
    const [showPassword, setShowPassword] = useState(false);

    const inputType = type === "password" && showPassword ? "text" : type;

    const baseClasses = "w-full rounded-md border px-4 py-3 outline-none transition-all font-body";

    const borderClasses = error
        ? "border-danger-600 focus:ring-1 focus:ring-danger-600"
        : disabled
            ? "border-gray-200 bg-gray-50 cursor-not-allowed"
            : "border-gray-300 focus:border-auxiliary-700 focus:ring-1 focus:ring-auxiliary-700";

    const textClasses = disabled ? "text-gray-400" : "text-[var(--color-black)]";

    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label className="text-sm font-semibold text-gray-700">
                    {label} {props.required && <span className="text-danger-600">*</span>}
                </label>
            )}
            
            <div className="relative group">
                <input
                    {...props}
                    type={inputType}
                    disabled={disabled}
                    className={`${baseClasses} ${borderClasses} ${textClasses} placeholder:text-gray-300 shadow-sm`}
                />
                {/* Mostramos el ojo solo si el tipo original era password */}
                {type === "password" && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-700 hover:text--primary-600 transition-colors"
                    >
                        {showPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        )}
                    </button>
                )}
            </div>

            {error && (
                <span className="text-xs font-medium text-danger-600 px-1">
                    {error}
                </span>
            )}
        </div>
    );
}