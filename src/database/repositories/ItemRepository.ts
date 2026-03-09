import type { PrendaData } from "../supabase/SupabaseItemRepository";


export interface ItemRepository {

    createPrenda(data: PrendaData): Promise<{ data?: any, error?: any }>;
    getPrendas(id_usuario: string): Promise<{ data?: any, error?: any }>;
    toggleFavorito(id_prenda: number, nuevoEstado: boolean): Promise<{ data?: any, error?: any }>;
        /**
     * Obtiene una lista de dias y número de prendas registradas
     * @returns Una promesa con la lista de usuarios o un error.
     */
    getNumPrendasDia(): Promise<{ data?: any[]; error?: any }>;
    /**
     * Obtiene el recuento total de prendas agrupadas por su categoría.
     * Ideal para gráficos circulares (PieChart).
     */
    getPrendasPorCategoria(): Promise<{ data?: any[]; error?: any }>;
}