export interface Profile {
  id?: string
  nombre_apellidos: string; 
  avatar_url?: string | null;
  rol: 'user' | 'admin'
}