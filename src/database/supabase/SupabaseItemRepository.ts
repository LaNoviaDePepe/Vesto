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
        })) || [];

        return { data: prendasMapped, error };

    }

    async createPrenda(data: PrendaData) {
        try {
            // Subir la imagen al Storage
            // Creamos un nombre único para el archivo (ej: usuarioID/timestamp.png)
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
            // Ajusta los nombres de las columnas según tu imagen de BBDD
            const { data: newPrenda, error: dbError } = await supabase
                .from('prendas')
                .insert({
                    id_usuario: data.userId, // Relación con la tabla usuarios
                    nombre: data.nombre,
                    categoria: data.tipoPrenda, // En tu BBDD se llama 'categoria'
                    color: data.color,
                    temporada: data.temporada,
                    url_imagen: publicUrl, // Guardamos la URL que nos dio el Storage
                    favorito: false, // Por defecto no es favorita
                    // fecha_alta se pone sola si tienes default now()
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
}