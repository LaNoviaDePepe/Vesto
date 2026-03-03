
/**
 * Componente visual que representa un espacio (slot) reservado para una prenda específica dentro de un conjunto.
 * * @param {Object} props - Propiedades del componente.
 * @param {string} props.label - Título de la categoría o posición (ej. "Cabeza", "Calzado").
 * @param {any | null} props.item - Objeto con los datos de la prenda. Puede ser null si el hueco está vacío.
 */
export function OutfitSlot({ label, item }: { label: string; item: any | null }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-bold text-primary-700 uppercase">{label}</span>
            <div className={`w-28 h-36 bg-white border-2 rounded-2xl flex items-center justify-center p-2 shadow-sm transition-all ${item ? 'border-primary-700 shadow-md' : 'border-dashed border-gray-300'
                }`}>
                <div className="w-full h-full bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center border border-gray-100">
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