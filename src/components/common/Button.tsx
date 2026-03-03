import type { ButtonHTMLAttributes } from "react";

/**
 * Interfaz que define las propiedades del componente Button.
 * Extiende los atributos nativos de un elemento <button> de HTML (ButtonHTMLAttributes),
 * lo que permite que el componente acepte props estándar como onClick, disabled, type, etc.,
 * manteniendo un tipado estricto.
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Define el estilo visual del botón basándose en el sistema de diseño.
   * Opcional: Si no se provee, tomará el valor por defecto definido en el componente.
   */
  variant?: "primary" | "secondary" | "auxiliar" | "out";
}

/**
 * Componente de interfaz de usuario (UI) reutilizable para botones.
 * Aplica estilos consistentes basados en una variante especificada y permite la inyección de clases adicionales.
 * * @param {ReactNode} children - El contenido a renderizar dentro del botón (texto, iconos, etc.).
 * @param {string} variant - La variante de estilo ("primary", "secondary", etc.). Por defecto es "primary".
 * @param {string} className - Clases CSS adicionales para extender o sobrescribir los estilos base.
 * @param {Object} props - El resto de las propiedades estándar de HTMLButtonElement (operador rest).
 */
export default function Button(
  { children, variant = "primary", className = "", ...props }: ButtonProps) {
  const baseStyles = "btn";
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    auxiliar: "btn-auxiliar",
    out: "btn-out"
  };

    return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}