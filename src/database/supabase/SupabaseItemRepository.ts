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
            console.error("Error:", error);
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
            console.error("Error agrupando categorías:", error);
            return { error };
        }
    }

}