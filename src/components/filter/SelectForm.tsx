import React from 'react';

interface SelectProps {
    name: string;
    options: string[];
    placeholder: string;
    error?: string;
    disabled?: boolean;
}

export default function SelectForm({ name, options, placeholder, error, disabled }: SelectProps) {
    return (
        <div className="">
            <select
                name={name}
                disabled={disabled}
                defaultValue=""
                className={`
                    border-4 border-red-500 bg-yellow-200 p-4`}
            >
                <option value="" disabled>
                    {placeholder}
                </option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>

            {error && (
                <span className="">
                    {error}
                </span>
            )}
        </div>
    );
}