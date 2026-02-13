import { supabase } from "./Client";

export interface ConjuntoData {
    nombre: string;
    id_usuario: string; 
    prendasIds: number[]; 
    favorito?: boolean;
}

export class SupabaseOutfitRepository {

    async createConjunto(data: ConjuntoData) {
        try {
            const { data: newOutfit, error: outfitError } = await supabase
                .from('conjuntos')
                .insert({
                    nombre: data.nombre,
                    id_usuario: data.id_usuario,
                    favorito: data.favorito || false
                })
                .select()
                .single();

            if (outfitError) {
                console.error("Error creando cabecera del conjunto:", outfitError);
                return { error: outfitError };
            }

            const relations = data.prendasIds.map(prendaId => ({
                id_conjunto: newOutfit.id,
                id_prenda: prendaId
            }));

            const { error: relationsError } = await supabase
                .from('conjunto_prendas')
                .insert(relations);

            if (relationsError) {
                console.error("Error vinculando prendas al conjunto:", relationsError);
                return { error: relationsError };
            }

            return { data: newOutfit };

        } catch (error) {
            console.error("Error inesperado al crear conjunto:", error);
            return { error };
        }
    }
}