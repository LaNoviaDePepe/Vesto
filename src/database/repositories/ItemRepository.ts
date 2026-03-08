import type { PrendaData } from "../supabase/SupabaseItemRepository";

/**
 * Interfaz que define las operaciones relacionadas con la gestión de prendas (ítems)
 * en el armario del usuario.
 */
export interface ItemRepository {

    /**
     * Crea una nueva prenda en el sistema.
     * Sube la imagen asociada al almacenamiento y guarda los metadatos en la base de datos.
     * 
     * @param data - Objeto con los datos de la prenda (nombre, color, imagen, etc.)
     * @returns Una promesa con los datos de la prenda creada o un error si falló.
     */
    createPrenda(data: PrendaData): Promise<{ data?: any, error?: any }>;

    /**
     * Recupera todas las prendas pertenecientes a un usuario específico.
     * 
     * @param id_usuario - El UUID del usuario dueño del armario.
     * @returns Una promesa con un array de las prendas mapeadas o un error.
     */
    getPrendas(id_usuario: string): Promise<{ data?: any, error?: any }>;

    /**
     * Alterna o establece el estado de "favorito" de una prenda específica.
     * 
     * @param id_prenda - El ID numérico de la prenda en la base de datos.
     * @param nuevoEstado - Booleano que indica si será favorita (true) o no (false).
     * @returns Una promesa con el resultado de la actualización o un error.
     */
    toggleFavorito(id_prenda: number, nuevoEstado: boolean): Promise<{ data?: any, error?: any }>;

    /**
     * Elimina una prenda del sistema de forma permanente.
     * Borra el registro en la base de datos y limpia el archivo del Storage.
     * 
     * @param id_prenda - El ID de la prenda a eliminar.
     * @param imageUrl - (Opcional) La URL de la imagen para borrarla del Storage.
     * @returns Una promesa que indica si hubo algún error durante el borrado.
     */
    deletePrenda(id_prenda: number, imageUrl?: string): Promise<{ error?: any }>;
}