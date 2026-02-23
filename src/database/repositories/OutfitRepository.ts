import type { ConjuntoData } from "../supabase/SupabaseOutfitRepository";

/**
 * Define las operaciones relacionadas con los conjuntos (outfits) de la aplicación.
 * 
 * Esta interfaz abstrae el acceso a los datos de los conjuntos y sus relaciones 
 * con las prendas, permitiendo desacoplar la lógica de negocio de la implementación 
 * específica de la base de datos (ej. Supabase).
 */
export interface OutfitRepository {

    /**
     * Obtiene todos los conjuntos guardados por un usuario específico.
     *
     * @param id_usuario - El identificador único del usuario (UUID).
     * @returns Una promesa con la lista de conjuntos mapeados o un error si la consulta falla.
     */
    getConjuntos(id_usuario: string): Promise<{ data?: any, error?: any }>;

    /**
     * Crea un nuevo conjunto en el sistema.
     * Este método gestiona de forma atómica:
     * 1. La subida de la imagen al storage (si existe).
     * 2. La creación de la cabecera del conjunto en la tabla 'conjuntos'.
     * 3. La vinculación de las prendas en la tabla relacional 'conjunto_prendas'.
     * 
     * @param data - Objeto con toda la información necesaria para crear el conjunto.
     * @param data.nombre - Nombre identificativo del conjunto.
     * @param data.id_usuario - ID del propietario del conjunto.
     * @param data.prendasIds - Array de IDs de las prendas que forman el outfit.
     * @param data.descripcion - (Opcional) Texto descriptivo o notas sobre el outfit.
     * @param data.favorito - (Opcional) Indica si el conjunto está marcado como destacado.
     * @param data.url_imagen - (Opcional) Archivo de imagen (File) para subir al storage.
     * 
     * @returns Una promesa con los datos del conjunto recién creado o un error si falla cualquier paso del proceso.
     */
    createConjunto(data: ConjuntoData): Promise<{ data?: any, error?: any }>;
}