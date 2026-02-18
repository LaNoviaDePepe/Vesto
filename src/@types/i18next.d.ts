import 'i18next';
// Importamos el JSON en español para usarlo como "molde"
import es from '../locales/es.json'; 

declare module 'i18next' {
  // Extendemos los tipos originales de la librería
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof es; // Aquí le decimos: "Las claves son las que hay en es.json"
    };
  }
}