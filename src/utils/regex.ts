import { t } from "i18next";

export const validateVestoField = (name: string, value: any, matchValue?: string) => {
    const valStr = value ? String(value) : "";

    switch (name) {
        case "nombre":
        case "nombreApellidos":
            if (!valStr.trim()) return t("validation.name_required");
            if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(value))
                return t("validation.only_letters");
            return "";

        case "email":
            if (!valStr.trim()) return t("validation.email_required");
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(valStr)) return t("validation.invalid_email");
            return "";

        case "usuario":
            if (!valStr.trim()) return t("validation.user_required");
            if (valStr.length < 3) return t("validation.min_3_chars");
            return "";

        case "password":
            if (!valStr) return t("validation.password_required");
            if (valStr.length < 6) return t("validation.min_6_chars");
            return "";

        case "verifPassword":
            if (!valStr) return t("validation.confirm_password_required");
            if (valStr !== matchValue) return t("validation.passwords_mismatch");
            return "";

        case "tipoPrenda":
        case "color":
        case "temporada":
            if (!valStr.trim()) return t("validation.select_option");
            return "";

        case "rememberMe":
        case "imagen":
            return "";

        default:
            return "";
    }
};