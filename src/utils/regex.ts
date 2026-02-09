export const validateVestoField = (name: string, value: any, matchValue?: string) => {
    const valStr = value ? String(value) : "";

    switch (name) {
        case "nombre":
            if (!valStr.trim()) return "El nombre es obligatorio";
            if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value))
                return "Solo se permiten letras y espacios";
            return "";

        case "nombreApellidos":
            if (!valStr.trim()) return "El nombre es obligatorio";
            if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value))
                return "Solo se permiten letras y espacios";
            return "";

        case "email":
            if (!valStr.trim()) return "El email es obligatorio";
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(valStr)) return "Formato de email inválido";
            return "";

        case "usuario":
            if (!valStr.trim()) return "El usuario es obligatorio";
            if (valStr.length < 3) return "Mínimo 3 caracteres";
            return "";

        case "password":
            if (!valStr) return "La contraseña es obligatoria";
            if (valStr.length < 6) return "Mínimo 6 caracteres";
            return "";

        case "verifPassword":
            if (!valStr) return "Debes confirmar la contraseña";
            if (valStr !== matchValue) return "Las contraseñas no coinciden";
            return "";

        case "tipoPrenda":
        case "color":
        case "temporada":
            if (!valStr.trim()) return "Debes seleccionar una opción";
            return "";

        case "rememberMe":
        case "imagen":
            return "";

        default:
            return "";
    }
};