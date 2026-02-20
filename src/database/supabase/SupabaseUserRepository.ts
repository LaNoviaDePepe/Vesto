import type { RegisterData } from "../../interfaces/RegisterData";
import type { SessionUser } from "../../interfaces/SessionUser";
import type { UserRepository } from "../repositories/UserRepository";
import { supabase } from "./Client";

export class SupabaseUserRepository implements UserRepository {

    // Implementación de crear usuario (Registro)
    async createUser(data: RegisterData): Promise<{ data?: SessionUser; error?: any }> {
        try {
            // Crear el usuario en Supabase Auth (Esto no cambia)
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                // Guardar metadatos en auth
                options: {
                    data: {
                        nombre_apellidos: data.nombre_apellidos // Guardamos también aquí por si acaso
                    }
                }
            });

            if (authError) return { error: authError };
            if (!authData.user) return { error: { message: "No se creó el usuario en Auth" } };

            // Insertar en tu tabla 'perfiles' 
            const { data: profileData, error: profileError } = await supabase
                .from('perfiles')
                .insert({
                    id: authData.user.id, // El ID viene de Auth
                    nombre_apellidos: data.nombre_apellidos,
                    rol: 'user',
                })
                .select()
                .single();

            if (profileError) {
                // Si falla la creación del perfil, borramos el usuario de Auth
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
            // Login en Auth
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) return { error: authError };
            if (!authData.user) return { error: { message: "Usuario no encontrado" } };

            // Obtener perfil asociado
            const { data: profile, error: profileError } = await supabase
                .from('perfiles')
                .select('*')
                .eq('id', authData.user.id)
                .single();

            if (profileError) {
                await supabase.auth.signOut(); // Seguridad: Si no hay perfil, cerramos sesión
                return { error: profileError };
            }

            // Construir respuesta
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
     * Actualiza el perfil del usuario y sus credenciales de autenticación.
     * * @param userId - El UUID del usuario a actualizar.
     * @param data - Objeto con los datos a modificar.
     * @param data.nombre_apellidos - Nuevo nombre para la tabla 'perfiles'.
     * @param data.email - Nuevo email (Cuidado: Supabase enviará un correo de confirmación al nuevo email).
     * @param data.password - (Opcional) Nueva contraseña. Si no se envía, no se cambia.
     * @param data.avatarUrl - (Opcional) URL pública de la nueva imagen de perfil.
     * * @returns Un objeto con `data` (el perfil actualizado) o `error`.
     */
    async updateProfile(
        userId: string,
        data: { nombre_apellidos: string; currentPassword?: string; newPassword?: string; avatarUrl?: string }
    ): Promise<{ data?: any; error?: any }> {
        try {
            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError || !userData.user) return { error: { message: "Sesión no válida" } };

            const currentEmail = userData.user.email;

            // SOLO gestionamos Contraseña
            if (data.newPassword) {
                if (!data.currentPassword) return { error: { message: "Falta contraseña actual" } };

                const { error: reAuthError } = await supabase.auth.signInWithPassword({
                    email: currentEmail!,
                    password: data.currentPassword
                });
                if (reAuthError) return { error: { message: "Contraseña actual incorrecta" } };

                const { error: updatePassError } = await supabase.auth.updateUser({ password: data.newPassword });
                if (updatePassError) return { error: updatePassError };
            }

            // Actualizar Tabla 'perfiles'
            const updates: any = { nombre_apellidos: data.nombre_apellidos };
            if (data.avatarUrl) updates.url_avatar = data.avatarUrl;

            const { data: updatedProfile, error: profileError } = await supabase
                .from('perfiles')
                .update(updates)
                .eq('id', userId)
                .select()
                .single();

            if (profileError) return { error: profileError };
            return { data: updatedProfile };

        } catch (error) { return { error }; }
    }

    /**
     * Sube una imagen al bucket 'avatars' de Supabase y retorna su URL pública.
     * * @param userId - El ID del usuario (usado para nombrar el archivo y evitar colisiones).
     * @param file - El objeto File proveniente del input HTML.
     * * @returns La URL pública de la imagen o un error.
     */
    async updateAvatar(userId: string, file: File): Promise<{ data?: string; error?: any }> {
        try {
            // Generamos un nombre único usando timestamp para evitar problemas de caché del navegador
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            // Subida al Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, {
                    upsert: true
                });

            if (uploadError) return { error: uploadError };

            // Obtención de URL Pública
            const { data } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            return { data: data.publicUrl };

        } catch (error) {
            return { error };
        }
    }
    async resetPasswordForEmail(email: string): Promise<{ error?: any }> {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                // Esta es la página donde el usuario escribirá su nueva contraseña
                redirectTo: "http://localhost:5173/reset-password",
            });
            return { error };
        } catch (error) {
            return { error };
        }
    }
}