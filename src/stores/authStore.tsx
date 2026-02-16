import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SessionUser } from '../interfaces/SessionUser'

interface AuthState {
    sessionUser: SessionUser | null
    isAuthenticated: boolean

    setSession: (sessionUser: SessionUser) => void
    clearSession: () => void
    updateSessionProfile: (profile: any) => void
}

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