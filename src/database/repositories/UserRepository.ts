import type { RegisterData } from "../../interfaces/RegisterData";
import type { SessionUser } from "../../interfaces/SessionUser";

/**
 * Define las operaciones relacionadas con los usuarios de la aplicación.
 *
 * Esta interfaz abstrae el acceso a datos, permitiendo implementar distintos
 * métodos de persistencia sin acoplar la lógica a una tecnología concreta.
 */
export interface UserRepository {

    /**
     * Crea un nuevo usuario autenticado y su perfil asociado.
     * @param data - Datos del usuario a crear.
     */
    createUser(data: RegisterData): Promise<{ data?: SessionUser, error?: any }>;

    /**   * Inicia sesión de un usuario existente.
     * @param data - Credenciales del usuario para iniciar sesión.
     */
    login(email: string, password: string): Promise<{ data?: SessionUser; error?: any }>

    /**
     * Cierra la sesión activa del usuario actual.
     * * @returns Una promesa que indica si hubo algún error durante el cierre de sesión.
     */
    logout(): Promise<{ error?: any }>;

    /**
     * Actualiza la información del perfil y/o las credenciales de seguridad del usuario.
     * * Este método maneja tanto datos públicos (nombre, avatar) como privados (email, password).
     * * @param userId - El identificador único (UUID) del usuario a actualizar.
     * @param data - Objeto con los campos a modificar.
     * @param data.nombre_apellidos - Nuevo nombre para mostrar.
     * @param data.email - Nuevo correo electrónico (puede requerir confirmación).
     * @param data.currentPassword - (Requerido para seguridad) La contraseña actual. Obligatoria si se intenta cambiar la contraseña (`newPassword`).
     * @param data.newPassword - (Opcional) La nueva contraseña que se desea establecer.
     * @param data.avatarUrl - (Opcional) La URL pública de la nueva imagen de perfil ya subida.
     * * @returns Una promesa con los datos del perfil actualizado o un error si la validación falla (ej. password actual incorrecta).
     */
    updateProfile(
        userId: string,
        data: {
            nombre_apellidos: string;
            email?: string;
            currentPassword?: string;
            newPassword?: string;
            avatarUrl?: string
        }
    ): Promise<{ data?: any; error?: any }>;

    /**
     * Sube un archivo de imagen al almacenamiento y devuelve su URL pública.
     * * @param userId - El ID del usuario, utilizado para generar una ruta única de archivo.
     * @param file - El archivo de imagen (File) proveniente de un input HTML.
     * @returns Una promesa con la URL pública de la imagen subida o un error de almacenamiento.
     */
    updateAvatar(userId: string, file: File): Promise<{ data?: string; error?: any }>;

    /**
     * Actualiza perfil y credenciales.
     * @param userId - El ID (uuid) del usuario.
     * @param data - Datos a actualizar.
     */
    updateUser(userId: string, data: { nombre_apellidos?: string }): Promise<{ error: any }>;

    /**
     * Envía un correo de recuperación al usuario.
     */
    resetPasswordForEmail(email: string): Promise<{ error?: any }>;

    /**
     * Obtiene una lista de todos los perfiles de usuario registrados.
     * @returns Una promesa con la lista de usuarios o un error.
     */
    getAllUsers(): Promise<{ data?: any[]; error?: any }>;

    /**
     * Obtiene el histórico de logins diarios de la tabla 'daily_logins'.
     */
    getDailyLogins(): Promise<{ data?: any[]; error?: any }>;

    /**
     * Elimina un usuario por completo.
     * @param userId - El ID (uuid) del usuario.
     */
    deleteUser(userId: string): Promise<{ error: any }>;

}