import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "secondary" | "auxiliar";
}

export default function Button(
  { children, variant = "primary", className = "", ...props }: ButtonProps) {
  const baseStyles = "btn";
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    auxiliar: "btn-auxiliar"
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