export interface OutfitRepository {
    getConjuntos(id_usuario: string): Promise<{ data?: any, error?: any }>;
}