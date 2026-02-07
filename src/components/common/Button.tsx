import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "auxiliar";
}

export default function Button(
  { children, variant = "primary", className = "", ...props }: ButtonProps) {
  const baseStyles = "h-[40px] min-w-[90px] flex items-center pl-[8px] pr-[8px] gap-[4px] bg-[#3b49df] text-white rounded-[4px] font-medium text-sm";
  const hoverStyles = "hover:cursor-pointer";
  const variants = {
    primary: "btn-primary",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    auxiliar: "bg-gray-200 text-gray-800 hover:bg-gray-300"
  };

    return (
    <button
      className={`${baseStyles} ${hoverStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}