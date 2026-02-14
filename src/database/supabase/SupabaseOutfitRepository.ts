import type { OutfitRepository } from "../repositories/OutfitRepository";
import { supabase } from "./Client";

export interface ConjuntoData {
    nombre: string;
    id_usuario: string;
    prendasIds: number[];
    favorito?: boolean;
}

export class SupabaseOutfitRepository implements OutfitRepository {

    async getConjuntos(id_usuario: string) {
        const { data, error } = await supabase
            .from('conjuntos')
            .select(`
            id,
            nombre,
            favorito,
            descripcion,
            fecha_alta,
            conjunto_prendas (
                prendas (
                    id,
                    nombre,
                    url_imagen,
                    color,
                    temporada
                )
            )
        `)
            .eq('id_usuario', id_usuario);

        const conjuntosMapped = data?.map(c => ({
            id: c.id,
            nombre: c.nombre,
            favorito: c.favorito,
            descripcion: c.descripcion,
            fechaAlta: c.fecha_alta,

            prendas: c.conjunto_prendas.map((cp: any) => ({
                id: cp.prendas.id,
                name: cp.prendas.nombre,
                url: cp.prendas.url_imagen,
                color: cp.prendas.color,
                temporada: cp.prendas.temporada,
            }))
        })) || [];

        return { data: conjuntosMapped, error };
    }

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