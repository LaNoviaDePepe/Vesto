interface SelectProps {
    name: string;
    options: string[];
    placeholder: string;
    error?: string;
    disabled?: boolean;
}

export default function Select({ name, options, placeholder, error, disabled }: SelectProps) {

    const baseClasses = 'w-full rounded-md border px-4 py-3 outline-none transition-colors';

    const borderClasses = error
        ? 'border-[var(--color-danger-600)]'
        : 'border-gray-300 focus:border-[var(--color-auxiliary-700)]';

    const textClasses =
        'text-gray-400 focus:text-gray-900';

    return (
        <div className="flex flex-col gap-1">
            <select
                name={name}
                disabled={disabled}
                defaultValue=""
                className={`${baseClasses} ${borderClasses} ${textClasses}`}
                onChange={(e) => {
                    e.currentTarget.classList.remove('text-gray-400');
                    e.currentTarget.classList.add('text-black');
                }}
            >
                <option value="" disabled className="text-gray-400">
                    {placeholder}
                </option>
                {options.map((option) => (
                    <option key={option} value={option} className="text-black">
                        {option}
                    </option>
                ))}
            </select>

            {error && (
                <span className="text-sm text-danger-600">
                    {error}
                </span>
            )}
        </div>
    );
}