import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Languages, Check } from 'lucide-react';
import Button from './Button';

// Definimos los idiomas disponibles en un array para mapearlos más limpio
const AVAILABLE_LANGUAGES = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'it', label: 'Italiano' },
  { code: 'ja', label: '日本語' }
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng); // Cambia el idioma en i18next
    setIsOpen(false);         // Cierra el menú
  };

  // Detecta si es el idioma actual para marcarlo en negrita/color
  const currentLang = i18n.language; 

  return (
    <div className="relative">
      {/* BOTÓN PRINCIPAL (Icono) */}
      <Button
        variant='icon'
        onClick={() => setIsOpen(!isOpen)}
        className="p-0 rounded-full min-w-0"
        aria-label="Cambiar idioma"
      >
        <Languages size={24} />
      </Button>

      {/* MENÚ DESPLEGABLE */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
          
          {/* Mapeamos el array para generar las opciones automáticamente */}
          {AVAILABLE_LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-gray-50
                ${currentLang === lang.code ? 'text-blue-600 font-medium' : 'text-gray-700'}
              `}
            >
              <span>{lang.label}</span>
              {currentLang === lang.code && <Check size={16} />}
            </button>
          ))}

        </div>
      )}
      
      {/* (Opcional) Fondo transparente para cerrar al hacer clic fuera */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)} 
        />
      )}
    </div>
  );
};