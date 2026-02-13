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

    logout(): Promise<{ error?: any }>;

    //resetPasswordForEmail(email: string): Promise<{ error?: any }>;
}