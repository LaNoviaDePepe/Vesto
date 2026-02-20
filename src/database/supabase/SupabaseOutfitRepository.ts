import type { OutfitRepository } from "../repositories/OutfitRepository";
import { supabase } from "./Client";

export interface ConjuntoData {
    nombre: string;
    id_usuario: string;
    prendasIds: number[];
    descripcion?: string;
    favorito?: boolean;
    imagen: File | null;
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
            // Subir la imagen al Storage
            // Creamos un nombre único para el archivo (ej: usuarioID/timestamp.png)
            if (!data.imagen) {
                return { error: new Error("La imagen es requerida") };
            }
            const fileExt = data.imagen.name.split('.').pop();
            const fileName = `${data.id_usuario}/${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('conjuntos')
                .upload(filePath, data.imagen);

            if (uploadError) {
                console.error("Error subiendo imagen:", uploadError);
                return { error: uploadError };
            }

            // Obtenemos la URL pública de la imagen
            const { data: { publicUrl } } = supabase.storage
                .from('conjuntos')
                .getPublicUrl(filePath);

            const { data: newOutfit, error: outfitError } = await supabase
                .from('conjuntos')
                .insert({
                    nombre: data.nombre,
                    descripcion: data.descripcion,
                    id_usuario: data.id_usuario,
                    favorito: data.favorito || false,
                    imagen: publicUrl
                })
                .select() //Devuelve el id del conjunto recién creado para poder realizar las inserciones en la tabla conjuntos_prendas
                .single();

            if (outfitError) {
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
                    
                await supabase
                    .storage
                    .from('conjuntos')
                    .remove([filePath]);
                return { error: relationsError };
            }

            return { data: newOutfit };

        } catch (error) {
            console.error("Error inesperado al crear conjunto:", error);
            return { error };
        }
    }
}