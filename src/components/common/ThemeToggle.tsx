import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

/**
 * Componente `ThemeToggle`.
 * * Gestiona el cambio entre el modo claro y el modo oscuro en la aplicación.
 * Inicializa el estado leyendo la preferencia guardada en `localStorage` o, 
 * en su defecto, la preferencia del sistema operativo del usuario.
 * * @returns {JSX.Element} Un botón interactivo con el icono correspondiente al tema actual.
 */
export default function ThemeToggle() {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
        return 'light'; 
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-110 active:scale-95 z-50"
            aria-label="Cambiar tema"
            title={theme === 'dark' ? "Activar modo claro" : "Activar modo oscuro"}
        >
            {theme === 'dark' ? (
                <Sun size={24} className="text-yellow-400" />
            ) : (
                <Moon size={24} className="text-gray-700" />
            )}
        </button>
    );
}