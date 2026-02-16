import type { RegisterData } from "../../interfaces/RegisterData";
import type { SessionUser } from "../../interfaces/SessionUser";
import type { UserRepository } from "../repositories/UserRepository";
import { supabase } from "./Client";

export class SupabaseUserRepository implements UserRepository {

    // Implementación de crear usuario (Registro)
    async createUser(data: RegisterData): Promise<{ data?: SessionUser; error?: any }> {
        try {
            // 1. Crear el usuario en Supabase Auth (Esto no cambia)
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                // Opcional: guardar metadatos en auth
                options: {
                    data: {
                        nombre_apellidos: data.nombre_apellidos // Guardamos también aquí por si acaso
                    }
                }
            });

            if (authError) return { error: authError };
            if (!authData.user) return { error: { message: "No se creó el usuario en Auth" } };

            // 2. Insertar en tu tabla 'perfiles' (AQUÍ ESTÁ EL CAMBIO)
            // La imagen muestra la tabla 'perfiles' y la columna 'nombre_apellidos'
            const { data: profileData, error: profileError } = await supabase
                .from('perfiles') // <--- Cambio: Nombre exacto de tu tabla en la foto
                .insert({
                    id: authData.user.id, // El ID viene de Auth
                    nombre_apellidos: data.nombre_apellidos,
                    rol: 'user', // Asegúrate que coincida con tu tipo ENUM 'rol_usuario'
                    // fecha_alta se pone sola si tienes default now() en la BBDD
                })
                .select()
                .single();

            if (profileError) {
                // Si falla la creación del perfil, es buena práctica borrar el usuario de Auth
                // para no dejar datos corruptos, o al menos loguearlo.
                console.error("Error creando perfil:", profileError);
                return { error: profileError };
            }

            const sessionUser: SessionUser = {
                user: authData.user,
                profile: profileData
            };

            return { data: sessionUser };

        } catch (error) {
            return { error };
        }
    }

    // Implementación de Login
    async login(email: string, password: string): Promise<{ data?: SessionUser; error?: any }> {
        try {
            // 1. Login en Auth
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) return { error: authError };
            if (!authData.user) return { error: { message: "Usuario no encontrado" } };

            // 2. Obtener perfil asociado
            const { data: profile, error: profileError } = await supabase
                .from('perfiles')
                .select('*')
                .eq('id', authData.user.id)
                .single();

            if (profileError) {
                await supabase.auth.signOut(); // Seguridad: Si no hay perfil, cerramos sesión
                return { error: profileError };
            }

            // 3. Construir respuesta
            const sessionUser: SessionUser = {
                user: authData.user,
                profile: profile
            };

            return { data: sessionUser };

        } catch (error) {
            return { error };
        }
    }

    async logout(): Promise<{ error?: any }> {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error("Error al cerrar sesión:", error);
        }
        return { error };
    }

    /**
         * Actualiza la contraseña (Auth) y los datos del perfil (Tabla 'perfiles')
         */
    async updateProfile(userId: string, data: { nombre: string; email: string; password?: string; avatarUrl?: string }): Promise<{ data?: any; error?: any }> {
        try {
            // Si viene password, actualizamos en Supabase Auth
            if (data.password) {
                const { error: authError } = await supabase.auth.updateUser({ password: data.password });
                if (authError) return { error: authError };
            }

            // Mapeo exacto a tus columnas de la tabla 'perfiles'
            const updates: any = {
                nombre_apellidos: data.nombre,
            };

            // SOLO si existe avatar nuevo
            if (data.avatarUrl !== undefined) {
                updates.url_avatar = data.avatarUrl;
            }

            if (data.email) {
                const { error: emailError } = await supabase.auth.updateUser({
                    email: data.email
                });
                if (emailError) return { error: emailError };
            }

            const { data: updatedProfile, error: profileError } = await supabase
                .from('perfiles')
                .update(updates)
                .eq('id', userId)
                .select()
                .single();

            if (profileError) return { error: profileError };

            return { data: updatedProfile };

        } catch (error) {
            return { error };
        }
    }

    /**
     * Sube la imagen al Storage y devuelve la URL pública
     */
    async updateAvatar(userId: string, file: File): Promise<{ data?: string; error?: any }> {
        try {
            // Generar nombre único para evitar caché
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            // Subir archivo al bucket 'avatars' (DEBES CREARLO EN SUPABASE STORAGE)
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, {
                    upsert: true // Sobrescribir si existe
                });

            if (uploadError) return { error: uploadError };

            // Obtener URL pública
            const { data } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            return { data: data.publicUrl };

        } catch (error) {
            return { error };
        }
    }
}