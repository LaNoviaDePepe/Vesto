import { create } from 'zustand';

// Almacen de datos de filtros

interface FilterState {

    // Datos:
    filters: {
        categoria: string;
        temporada: string;
        color: string;
    };

    // Acciones:

    // Función para actualizar un filtro específico
    setFilter: (key: 'categoria' | 'temporada' | 'color', value: string) => void;
    // Función para limpiar todo 
    resetFilters: () => void;
}


// 'useFilterStore' es un Hook personalizado que hemos creado.
// Cualquier componente que quiera saber qué filtros hay puestos, 
// solo tiene que importar esto y llamarlo.
export const useFilterStore = create<FilterState>()((set) => ({

    // ESTADO INICIAL
    // Al cargar la app, todos los filtros están vacíos.
    filters: {
        categoria: "",
        temporada: "",
        color: ""
    },

    // LÓGICA PARA CAMBIAR UN FILTRO
    // Cuando alguien llama a setFilter('color', 'rojo')...
    setFilter: (key, value) =>
        set((state) => ({
            filters: {
                // El operador '...' sirve para persistir los filtros previamente seleccionados
                // Si no hacemos esto, por ej al cambiar el color, borraríamos la categoría y la temporada
                ...state.filters,
                // sobrescribimos SOLO el que ha cambiado
                [key]: value
            }
        })),

    // LÓGICA PARA RESETEAR FILTROS   
    resetFilters: () =>
        set(() => ({
            filters: { categoria: "", temporada: "", color: "" }
        }))
}));
