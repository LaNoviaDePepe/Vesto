import type { PrendaData } from "../supabase/SupabaseItemRepository";


export interface ItemRepository {

    createPrenda(data: PrendaData): Promise<{ data?: any, error?: any }>;
    getPrendas(id_usuario: string): Promise<{ data?: any, error?: any }>;
    toggleFavorito(id_prenda: number, nuevoEstado: boolean): Promise<{ data?: any, error?: any }>;
}