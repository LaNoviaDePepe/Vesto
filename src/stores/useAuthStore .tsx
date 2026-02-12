import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SessionUser } from '../interfaces/SessionUsers'

interface AuthState {
    sessionUser: SessionUser | null
    isAuthenticated: boolean

    setSession: (sessionUser: SessionUser) => void
    clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            sessionUser: null,
            isAuthenticated: false,
            // Cuando hacemos login, guardamos el usuario y ponemos auth a true
            setSession: (sessionUser) => set({ sessionUser, isAuthenticated: true }),
            // Cuando hacemos logout, limpiamos todo
            clearSession: () => set({ sessionUser: null, isAuthenticated: false }),
        }),
        {
            name: 'auth-v1', // Nombre en localStorage
            partialize: (state) => ({ 
                sessionUser: state.sessionUser,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)