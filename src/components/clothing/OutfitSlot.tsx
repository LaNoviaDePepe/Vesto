

export function OutfitSlot({ label, item }: { label: string; item: any | null }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-bold text-primary-700 dark:text-primary-100 dark:text-outline uppercase">{label}</span>
            <div className={`w-28 h-36 bg-white dark:bg-gray-900 border-2 rounded-2xl flex items-center justify-center p-2 shadow-sm transition-all ${item ? 'border-primary-700 shadow-md dark:border-primary-500' : 'border-dashed border-gray-300 dark:border-gray-600'
                }`}>
                <div className="w-full h-full bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center border border-gray-100 dark:border-gray-600">
                    {item ? (
                        <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-gray-300 text-3xl font-light">+</span>
                    )}
                </div>
            </div>
        </div>
    );
}