import { useState, type ChangeEvent, type FocusEvent } from "react";
import { validateVestoField } from "../../utils/regex";
import Button from "../common/Button";
import Input from "../common/Input";
import { useAuth } from "../../hooks/useAuth";
import { SupabaseUserRepository } from "../../database/supabase/SupabaseUserRepository";
import { toast } from "react-hot-toast";
import { isEmailTaken } from "../../database/supabase/RPCs/isEmailTaken";

interface LoginFormProps {
    email: string;
    password: string;
    rememberMe: boolean;
}

interface ErrorsProps {
    email: string;
    password: string;
    rememberMe: string;
}

export default function LoginForm() {
    const { login, loading, error: authError } = useAuth();
    const userRepository = new SupabaseUserRepository();

    const [formData, setFormData] = useState<LoginFormProps>({
        email: "",
        password: "",
        rememberMe: false
    });

    const [errors, setErrors] = useState<ErrorsProps>({
        email: "",
        password: "",
        rememberMe: ""
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === "checkbox" ? checked : value;
        setFormData((prev) => ({ ...prev, [name]: finalValue }));
        if (type !== "checkbox") {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (e.target.type !== "checkbox") {
            const error = validateVestoField(name, value);
            setErrors((prev) => ({ ...prev, [name]: error }));
        }
    };

    const handleForgotPassword = async () => {
        const emailError = validateVestoField("email", formData.email);

        if (!formData.email || emailError) {
            toast.error("Introduce un email válido para recuperar tu cuenta");
            setErrors(prev => ({ ...prev, email: emailError || "Email requerido" }));
            return;
        }

        // CORRECCIÓN: Usamos formData.email en lugar de e.target.value
        const taken = await isEmailTaken(formData.email);

        if (!taken) {
            toast.error("El correo electrónico no está registrado");
            setErrors(prev => ({ ...prev, email: "Correo no registrado" }));
            return;
        }

        const { error } = await userRepository.resetPasswordForEmail(formData.email);

        if (error) {
            toast.error("Error al enviar el enlace de recuperación");
        } else {
            toast.success(
                `¡Enlace enviado! Revisa tu correo (${formData.email})`,
                {
                    duration: 6000,
                    icon: '📧',
                }
            );
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors = {
            email: validateVestoField("email", formData.email),
            password: validateVestoField("password", formData.password),
            rememberMe: ""
        };
        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(Boolean);

        if (!hasErrors) {
            await login(formData.email, formData.password);
        }
    };

    return (
        <div className="py-5 px-7.5 max-w-md mx-auto bg-white border-2 border-auxiliary-700 rounded-2xl shadow-xl">
            <h3 className="text-center mb-8">Login</h3>

            {authError && (
                <div className="bg-red-100 text-red-600 p-2 mb-4 rounded text-center text-sm">
                    {authError}
                </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4">
                <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.email}
                    placeholder="ejemplo@correo.com"
                />

                <div className="flex flex-col">
                    <Input
                        label="Contraseña"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.password}
                        placeholder="••••••••"
                    />

                    <div className="flex justify-end mt-1">
                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="text-[11px] text-primary-600 hover:text-primary-800 underline transition-colors font-medium"
                        >
                            ¿Has olvidado tu contraseña?
                        </button>
                    </div>
                </div>

                <Input
                    label="Recuérdame"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    error={errors.rememberMe}
                />

                <Button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full mt-4"
                >
                    {loading ? "Cargando..." : "Acceder"}
                </Button>
            </form>
        </div>
    );
}