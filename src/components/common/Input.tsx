import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export default function Input({ label, error, disabled, ...props }: InputProps) {
    const baseClasses = "w-full rounded-md border px-4 py-3 outline-none transition-all font-body";

    const borderClasses = error
        ? "border-color-danger-600 focus:ring-1 focus:ring-danger-600"
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
            {/* Para poner el ojo cuando es type password */}
            <div className="relative group">
                <input
                    className={`${baseClasses} ${borderClasses} ${textClasses} placeholder:text-gray-300 shadow-sm`}
                    disabled={disabled}
                    {...props}
                />

                {props.type === "password" && (
                    <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-700 hover:text-primary-600 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
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