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
                return { error: dbError };
            }

            return { data: newPrenda };

        } catch (error) {
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
                        await supabase.storage
                            .from('prendas')
                            .remove([filePath]);
                    }
                }
            }
            return {};

        } catch (error) {
            return { error };
        }
    }

    async toggleFavorito(id_prenda: number, nuevoEstado: boolean) {

        const { data, error } = await supabase
            .from('prendas')
            .update({ favorito: nuevoEstado })
            .eq('id', id_prenda)
            .select();

        return { data, error };
    }

    async getNumPrendasDia(): Promise<{ data?: any[]; error?: any }> {
        try {
            // Obtener todas las fechas (repetidas también)
            const { data, error } = await supabase
                .from('prendas')
                .select('fecha_alta');

            if (error) {
                return { error };
            }

            const counts: { [key: string]: number } = {};

            for (const item of data) {
                const fullDate = item.fecha_alta;
                const dayOnly = fullDate.split('T')[0];

                if (counts[dayOnly] === undefined) {
                    counts[dayOnly] = 0;
                }

                counts[dayOnly] = counts[dayOnly] + 1;
            }

            const finalFormat = [];

            for (const date in counts) {
                finalFormat.push({
                    day: date,
                    quantity: counts[date]
                });
            }

            finalFormat.sort((a, b) => a.day.localeCompare(b.day));

            return { data: finalFormat };

        } catch (error) {
            return { error };
        }
    }

    async getPrendasPorCategoria(): Promise<{ data?: any[]; error?: any }> {
        try {
            // Pedimos lo que queremos
            const { data, error } = await supabase
                .from('prendas')
                .select('categoria');

            if (error) {
                return { error };
            }

            const counts: { [key: string]: number } = {};

            // Contamos cuántas prendas hay de cada categoría
            for (const item of data) {
                // Manejamos el caso de que la categoría venga vacía 
                const cat = item.categoria || 'Sin categoría';

                if (counts[cat] === undefined) {
                    counts[cat] = 0;
                }
                counts[cat] = counts[cat] + 1;
            }

            // Recharts para PieChart espera un formato exacto: [{ name: 'A', value: 10 }]
            const finalFormat = Object.keys(counts).map(key => ({
                name: key,
                value: counts[key]
            }));

            // Ordenamos de mayor a menor cantidad para que el gráfico quede más estético
            finalFormat.sort((a, b) => b.value - a.value);

            return { data: finalFormat };

        } catch (error) {
            return { error };
        }
    }

}