import type { PrendaData } from "../supabase/SupabaseItemRepository";


export interface ItemRepository {

    createPrenda(data: PrendaData): Promise<{ data?: any, error?: any }>;
}