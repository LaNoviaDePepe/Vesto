export interface Profile {
  id?: string
  nombre_apellidos: string; 
  url_avatar?: string | null;
  rol: 'user' | 'admin'
}