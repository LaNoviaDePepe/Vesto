import { useState, type ChangeEvent, type FocusEvent } from "react";
import { validateVestoField } from "../../utils/regex";
import Button from "../common/Button";
import Input from "../common/Input";
import { useAuth } from "../../hooks/useAuth";

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
    // Extraemos las funciones y estados del hook
    const { login, loading, error: authError } = useAuth();

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

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        const newErrors = {
            email: validateVestoField("email", formData.email),
            password: validateVestoField("password", formData.password),
            rememberMe: "" // Generalmente el checkbox no bloquea el login
        };
        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(Boolean);

        if (!hasErrors) {
            // Llamamos a la función login del Hook
            const success = await login(formData.email, formData.password);

            if (success) {
                alert("¡Sesión iniciada con éxito!");
                // Aquí podrías usar un navigate('/dashboard') si usas react-router
            }
        }
    };

    return (
        <div className="py-5 px-7.5 max-w-md mx-auto bg-white border-2 border-auxiliary-700 rounded-2xl shadow-xl">
            <h3 className="text-center mb-8">Login</h3>

            {/* Mostrar error general de Supabase si existe */}
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
                />

                <Input
                    label="Contraseña"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.password}
                />

                <Input
                    label="Recuérdame"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    error={errors.rememberMe}
                />

                {/* Deshabilitar botón mientras carga */}
                <Button type="submit" disabled={loading} className="btn btn-primary w-full">
                    {loading ? "Cargando..." : "Acceder"}
                </Button>
            </form>
        </div>
    );
}