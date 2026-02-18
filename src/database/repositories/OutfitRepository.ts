import type { ConjuntoData } from "../supabase/SupabaseOutfitRepository";



export interface OutfitRepository {

    createConjunto(data: ConjuntoData) : Promise<{ data?: any, error?: any }>;
}