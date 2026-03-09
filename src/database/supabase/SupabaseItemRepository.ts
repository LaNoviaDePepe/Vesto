import type { ItemRepository } from "../repositories/ItemRepository";
import { supabase } from "./Client";

// Definimos la interfaz del objeto que vamos a guardar
export interface PrendaData {
    nombre: string;
    tipoPrenda: string; // categoría
    color: string;
    temporada: string;
    imagen: File;
    userId: string; // Necesitamos saber de quién es la prenda
}

export class SupabaseItemRepository implements ItemRepository {

    async getPrendas(id_usuario: string) {
        const { data, error } = await supabase
            .from('prendas')
            .select('*')
            .eq('id_usuario', id_usuario);

        const prendasMapped = data?.map(p => ({
            id: p.id,
            name: p.nombre,
            url: p.url_imagen,
            color: p.color,
            temporada: p.temporada,
            categoria: p.categoria,
            favorito: p.favorito
        })) || [];

        return { data: prendasMapped, error };

    }

    async createPrenda(data: PrendaData) {
        try {
            // Subir la imagen al Storage
            // Creamos un nombre único para el archivo. Formato: "{ID_DEL_USUARIO}/{TIMESTAMP_ACTUAL}.{EXTENSION_DEL_ARCHIVO}"
            const fileExt = data.imagen.name.split('.').pop();
            const fileName = `${data.userId}/${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('prendas')
                .upload(filePath, data.imagen);

            if (uploadError) {
                console.error("Error subiendo imagen:", uploadError);
                return { error: uploadError };
            }

            // Obtenemos la URL pública de la imagen
            const { data: { publicUrl } } = supabase.storage
                .from('prendas')
                .getPublicUrl(filePath);


            // Guardar los datos en la tabla 'prendas' 
            const { data: newPrenda, error: dbError } = await supabase
                .from('prendas')
                .insert({
                    id_usuario: data.userId, 
                    nombre: data.nombre,
                    categoria: data.tipoPrenda, 
                    color: data.color,
                    temporada: data.temporada,
                    url_imagen: publicUrl, // Guardamos la URL que nos dio el Storage
                    favorito: false, // Por defecto no es favorita
                })
                .select()
                .single();

            if (dbError) {
                console.error("Error guardando en BBDD:", dbError);
                return { error: dbError };
            }

            return { data: newPrenda };

        } catch (error) {
            console.error("Error inesperado:", error);
            return { error };
        }
    }

    async deletePrenda(id_prenda: number, imageUrl?: string) {
        try {
            // Intentamos borrar el registro de la base de datos
            const { error: delError } = await supabase
                .from('prendas')
                .delete()
                .eq('id', id_prenda);

            if (delError) {
                console.error("Error al borrar prenda de la BBDD:", delError);
                return { error: delError };
            }

            // Si el borrado en BBDD fue exitoso, procedemos a borrar la imagen del Storage para que no quede huérfana y no ocupar espacio.
            if (imageUrl) {
                const basePath = '/object/public/prendas/';
                const urlParts = imageUrl.split(basePath);
                
                if (urlParts.length > 1) {
                    const filePath = decodeURIComponent(urlParts[1]); 
                    // urlParts[1] almacena nombreDeFoto.extension. Decodificamos para conservar espacios y caracteres especiales.

                    if (filePath) {
                        const { error: storageError } = await supabase.storage
                            .from('prendas')
                            .remove([filePath]);
                        
                        if (storageError) {
                            console.error("Prenda borrada, pero error al borrar imagen del Storage:", storageError);
                            // No retornamos este error porque a nivel de usuario la prenda ya se borró de su armario
                        }
                    }
                }
            }

            console.log(`Prenda ${id_prenda} eliminada correctamente`);
            return {};

        } catch (error) {
            console.error("Error inesperado al borrar prenda:", error);
            return { error };
        }
    }

    async toggleFavorito(id_prenda: number, nuevoEstado: boolean) {
        console.log(`Intentando guardar prenda ${id_prenda} como favorito: ${nuevoEstado}`);
        
        const { data, error } = await supabase
            .from('prendas')
            .update({ favorito: nuevoEstado })
            .eq('id', id_prenda) 
            .select();

        if (error) {
            console.error("❌ Error en Supabase al guardar favorito:", error.message);
        } else {
            console.log("✅ Guardado en Supabase con éxito", data);
        }

        return { data, error };
    }

}