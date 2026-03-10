import type { OutfitRepository } from "../repositories/OutfitRepository";
import { supabase } from "./Client";

export interface ConjuntoData {
    nombre: string;
    id_usuario: string;
    prendasIds: number[];
    descripcion?: string;
    favorito?: boolean;
    url_imagen?: File;
}

export class SupabaseOutfitRepository implements OutfitRepository {
    // Límite de 1MB en bytes
    private readonly MAX_FILE_SIZE = 1 * 1024 * 1024;

    async getConjuntos(id_usuario: string) {
        const { data, error } = await supabase
            .from('conjuntos')
            .select(`
            *,
            conjunto_prendas (
                prendas (*)
            )
        `)
            .eq('id_usuario', id_usuario);

        const conjuntosMapped = data?.map(c => ({
            id: c.id,
            nombre: c.nombre,
            favorito: c.favorito,
            descripcion: c.descripcion,
            fechaAlta: c.fecha_alta,
            url_imagen: c.url_imagen,

            prendas: c.conjunto_prendas?.map((cp: any) => ({
                id: cp.prendas.id,
                name: cp.prendas.nombre,
                url: cp.prendas.url_imagen,
                color: cp.prendas.color,
                temporada: cp.prendas.temporada,
                categoria: cp.prendas.categoria,
            })) || []
        })) || [];

        return { data: conjuntosMapped, error };
    }


    async createConjunto(data: ConjuntoData) {
        let publicUrl = "";
        let storagePath: string | null = null;

        // URL de la imagen por defecto 
        const DEFAULT_IMAGE_URL = "/img/default-outfit.png";

        try {
            // Lógica de imagen como campo opcional
            if (data.url_imagen) {

                // --- NUEVA VALIDACIÓN DE TAMAÑO ---
                if (data.url_imagen.size > this.MAX_FILE_SIZE) {
                    return {
                        error: {
                            message: `La imagen del conjunto es demasiado grande. El máximo permitido es 1MB.`
                        }
                    };
                }
                // ----------------------------------

                const fileExt = data.url_imagen.name.split('.').pop();
                const fileName = `${Date.now()}.${fileExt}`;
                storagePath = `${data.id_usuario}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('conjuntos')
                    .upload(storagePath, data.url_imagen);

                if (uploadError) {
                    console.error("Error subiendo imagen:", uploadError);
                    return { error: uploadError };
                }

                const { data: urlData } = supabase.storage
                    .from('conjuntos')
                    .getPublicUrl(storagePath);

                publicUrl = urlData.publicUrl;
            } else {
                publicUrl = DEFAULT_IMAGE_URL;
            }

            const { data: newOutfit, error: outfitError } = await supabase
                .from('conjuntos')
                .insert({
                    nombre: data.nombre,
                    descripcion: data.descripcion,
                    id_usuario: data.id_usuario,
                    url_imagen: publicUrl,
                    favorito: false
                })
                .select()
                .single();

            if (outfitError) {
                if (storagePath) {
                    await supabase.storage.from('conjuntos').remove([storagePath]);
                }
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
                await supabase
                    .from('conjuntos')
                    .delete()
                    .eq('id', newOutfit.id);

                if (storagePath) {
                    await supabase.storage.from('conjuntos').remove([storagePath]);
                }
                return { error: relationsError };
            }

            return { data: newOutfit };

        } catch (error) {
            console.error("Error inesperado al crear conjunto:", error);
            return { error };
        }
    }

    async deleteConjunto(id_conjunto: number, url_imagen: string) {
        try {
            const { error: deleteError } = await supabase
                .from('conjuntos')
                .delete()
                .eq('id', id_conjunto);

            if (deleteError) throw deleteError;

            const DEFAULT_IMAGE_URL = "/img/default-outfit.png";
            if (url_imagen && !url_imagen.includes(DEFAULT_IMAGE_URL)) {
                const urlParts = url_imagen.split('/object/public/conjuntos/');
                if (urlParts.length > 1) {
                    const filePath = urlParts[1];
                    await supabase.storage.
                        from('conjuntos').
                        remove([filePath]);
                }
            }

            return { data: true };
        } catch (error) {
            console.error("Error al eliminar conjunto:", error);
            return { error };
        }
    }


    async isFavorito(id_conjunto: number, nuevoEstado: boolean) {
        const { data, error } = await supabase
            .from('conjuntos')
            .update({ favorito: nuevoEstado })
            .eq('id', id_conjunto)
            .select();

        if (error) {
            console.error("Error en Supabase al guardar favorito:", error.message);
        }

        return { data, error };
    }
}