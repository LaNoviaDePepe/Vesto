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
        let publicUrl = "";
        let storagePath: string | null = null; // Variable de control para el borrado en storage

        // URL de la imagen por defecto 
        const DEFAULT_IMAGE_URL = "/img/default-outfit.png";

        try {
            // Lógica de imagen opcional
            if (data.url_imagen) {
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

                // Obtenemos la URL pública de la imagen recién subida
                const { data: urlData } = supabase.storage
                    .from('conjuntos')
                    .getPublicUrl(storagePath);

                publicUrl = urlData.publicUrl;
            } else {
                publicUrl = DEFAULT_IMAGE_URL; // Si no hay imagen, usamos la de por defecto
            }

            const { data: newOutfit, error: outfitError } = await supabase
                .from('conjuntos')
                .insert({
                    nombre: data.nombre,
                    descripcion: data.descripcion,
                    id_usuario: data.id_usuario,
                    favorito: data.favorito || false,
                    url_imagen: publicUrl
                })
                .select() //Devuelve el id del conjunto recién creado para poder realizar las inserciones en la tabla conjuntos_prendas
                .single();

            if (outfitError) {
                // Si falla la inserción de la cabecera, limpiamos la imagen si se subió una
                if (storagePath) {
                    await supabase.storage.from('conjuntos').remove([storagePath]);
                }
                console.error("Error creando cabecera del conjunto:", outfitError);
                return { error: outfitError };
            }

            // Creamos un Array de objetos en el que cada objeto corresponde a una tupla con formato { id_conjunto: 10, id_prenda: 5  }
            const relations = data.prendasIds.map(prendaId => ({
                id_conjunto: newOutfit.id,
                id_prenda: prendaId
            }));

            const { error: relationsError } = await supabase
                .from('conjunto_prendas')
                .insert(relations); // Inserción de múltiples tuplas en una única sentencia

            if (relationsError) {
                console.error("Error vinculando prendas al conjunto:", relationsError);
                // En el caso de haber un error en la inserción, evitamos que queden 'restos' de un conjunto 
                // incompleto o fallido, borrando la tupla que acabamos de insertar.
                await supabase
                    .from('conjuntos')
                    .delete()
                    .eq('id', newOutfit.id);

                // Borramos la imagen del storage solo si se subió una nueva
                // Usamos storagePath para evitar errores al intentar procesar la URL por defecto
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
}