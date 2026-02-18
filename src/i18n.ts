import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import es from './locales/es.json';
import en from './locales/en.json';

// Definimos los recursos
export const defaultNS = 'translation';
export const resources = {
  es: { translation: es },
  en: { translation: en },
} as const; // <--- 'as const' para el tipado estricto

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    defaultNS,
    resources,
    lng: 'es', // Idioma por defecto (o usar un detector para coger el del navegador y quitar esta línea)
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false, // React ya protege contra XSS (Cross-Site Scripting)
    },
  });

export default i18n;
