import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SessionUser } from '../interfaces/SessionUser'

/**
 * Define el estado global de la sesión del usuario en la aplicación.
 * * Contiene tanto la información del usuario (perfil y cuenta) como las acciones
 * para modificar este estado (login, logout, actualizaciones parciales).
 */
interface AuthState {
    /**
     * Objeto con toda la información de la sesión actual.
     * Contiene `user` (Auth de Supabase) y `profile` (Tabla de base de datos).
     * Es `null` si no hay sesión activa.
     */
    sessionUser: SessionUser | null

    /**
     * Bandera rápida para comprobar si el usuario está logueado.
     * @example if (isAuthenticated) { ... }
     */
    isAuthenticated: boolean

    /**
     * Establece una nueva sesión completa. Se usa típicamente tras un Login o Registro exitoso.
     * Automáticamente pone `isAuthenticated` a `true`.
     * @param sessionUser - El objeto con los datos del usuario y perfil recuperados.
     */
    setSession: (sessionUser: SessionUser) => void

    /**
     * Limpia la sesión actual. Se usa para el Logout.
     * Resetea el usuario a `null` y `isAuthenticated` a `false`.
     */
    clearSession: () => void

    /**
         * Actualiza **solo** los datos del perfil (Tabla 'perfiles') en el estado local.
         * * Úsalo para reflejar cambios visuales (nombre, avatar) inmediatamente en la UI
         * sin necesidad de recargar la página tras guardar en la base de datos.
         * @param profile - Objeto parcial con los datos del perfil a actualizar.
         */
    updateSessionProfile: (profile: any) => void

    /**
     * Actualiza **solo** los datos del usuario de autenticación (Supabase Auth).
     * * Úsalo cuando cambies datos sensibles como el email o metadatos de auth,
     * para que el estado local coincida con la sesión real del backend.
     * @param userUpdates - Objeto parcial con los datos del usuario (User) a actualizar.
     */
    updateSessionUser: (userUpdates: Partial<SessionUser['user']>) => void
}

/**
 * Hook global para gestionar la autenticación.
 * * Utiliza el middleware `persist` para guardar la sesión en el `localStorage` del navegador,
 * permitiendo que el usuario permanezca logueado aunque recargue la página.
 */
export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            sessionUser: null,
            isAuthenticated: false,

            setSession: (sessionUser) => set({ sessionUser, isAuthenticated: true }),

            clearSession: () => set({ sessionUser: null, isAuthenticated: false }),

            updateSessionProfile: (newProfile) => set((state) => ({
                sessionUser: state.sessionUser
                    ? { ...state.sessionUser, profile: { ...state.sessionUser.profile, ...newProfile } }
                    : null
            })),

            updateSessionUser: (userUpdates) => set((state) => ({
                sessionUser: state.sessionUser
                    ? { ...state.sessionUser, user: { ...state.sessionUser.user, ...userUpdates } }
                    : null
            }))
        }),
        {
            name: 'auth-v1',
            partialize: (state) => ({
                sessionUser: state.sessionUser,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)