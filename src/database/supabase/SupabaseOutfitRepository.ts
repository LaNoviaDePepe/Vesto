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
            *,
            conjunto_prendas (
                prendas (*)
            )
        `) // IMPORTANTE: Volver a traer las relaciones
            .eq('id_usuario', id_usuario);

        const conjuntosMapped = data?.map(c => ({
            id: c.id,
            nombre: c.nombre,
            favorito: c.favorito,
            descripcion: c.descripcion,
            fechaAlta: c.fecha_alta,
            url_imagen: c.url_imagen, // Aquí se guarda la URL (ya sea la de Supabase o la default)

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
        let storagePath: string | null = null; // Variable de control para el borrado en storage

        // URL de la imagen por defecto 
        const DEFAULT_IMAGE_URL = "/img/default-outfit.png";

        try {
            // Lógica de imagen como campo opcional
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
                    url_imagen: publicUrl,
                    favorito: false
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

    async deleteConjunto(id_conjunto: number, url_imagen: string) {
        try {
            // Eliminamos el registro de la base de datos
            // Las relaciones en 'conjunto_prendas' se borran automáticamente al existir ON DELETE CASCADE sobre la FK id_conjunto
            const { error: deleteError } = await supabase
                .from('conjuntos')
                .delete()
                .eq('id', id_conjunto);

            if (deleteError) throw deleteError;

            // Eliminamos la imagen del storage si no es la de por defecto
            const DEFAULT_IMAGE_URL = "/img/default-outfit.png";
            if (url_imagen && !url_imagen.includes(DEFAULT_IMAGE_URL)) {
                // Extraemos el path relativo (usuario/nombre-archivo) de la URL pública
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
        console.log(`Intentando guardar conjunto ${id_conjunto} como favorito: ${nuevoEstado}`);

        const { data, error } = await supabase
            .from('conjuntos')
            .update({ favorito: nuevoEstado })
            .eq('id', id_conjunto)
            .select();

        if (error) {
            console.error("Error en Supabase al guardar favorito:", error.message);
        } else {
            console.log("Guardado en Supabase con éxito", data);
        }

        return { data, error };
    }
}