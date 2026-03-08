import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
    // 1. Estado inicial
    const [theme, setTheme] = useState(() => {
        // ¿Tiene algo guardado en localStorage?
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        // ¿El sistema tiene el modo oscuro?
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        return 'light'; // Por defecto
    });

    // 2. Cada vez que 'theme' cambia, actualizamos el DOM y localStorage
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

    // 3. Función para alternar
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Cambiar tema"
        >
            {theme === 'dark' ? (
                <Sun size={24} className="text-yellow-400" />
            ) : (
                <Moon size={24} className="text-white-700" />
            )}
        </button>
    );
}