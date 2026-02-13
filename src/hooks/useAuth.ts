import { useState } from 'react';// Ajusta la ruta
import type { RegisterData } from '../interfaces/RegisterData';
import { SupabaseUserRepository } from '../database/supabase/SupabaseUserRepository';
import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
    // Instanciamos el repositorio 
    const authRepository = new SupabaseUserRepository();

    // Traemos la función del store 
    const setSession = useAuthStore((state) => state.setSession);

    // Estado local para la UI (Cargando y Errores)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (email: string, pass: string) => {
        setLoading(true);
        setError(null);

        try {
            const { data, error: repoError } = await authRepository.login(email, pass);

            if (repoError) {
                setError(repoError.message || 'Error al iniciar sesión');
                return false;
            }

            if (data) {
                setSession(data); // Guardamos en Zustand
                return true;
            }
        } catch (err) {
            setError('Error inesperado');
        } finally {
            setLoading(false);
        }
        return false;
    };

    const register = async (data: RegisterData) => {
        setLoading(true);
        setError(null);

        try {
            const { data: sessionUser, error: repoError } = await authRepository.createUser(data);

            if (repoError) {
                setError(repoError.message || 'Error al registrar');
                return false;
            }

            if (sessionUser) {
                setSession(sessionUser); // Guardamos en Zustand
                return true;
            }
        } catch (err) {
            setError('Error inesperado');
        } finally {
            setLoading(false);
        }
        return false;
    }

    const logout = async () => {
        await authRepository.logout();
        useAuthStore.getState().clearSession(); // Limpia Zustand
    };

    return {
        login,
        register,
        logout,
        loading,
        error
    };
};