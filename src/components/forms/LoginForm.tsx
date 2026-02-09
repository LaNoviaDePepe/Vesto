import { useState, type ChangeEvent, type FocusEvent } from "react";
import { validateVestoField } from "../../utils/regex";
import Button from "../common/Button";
import { createUserRepository } from "../../database/repositories/repositories";
import Input from "../common/Input";

const userRepository = createUserRepository();

interface LoginFormProps {
    usuario: string;
    password: string;
    rememberMe: boolean;
}

interface ErrorsProps {
    usuario: string;
    password: string;
    rememberMe: string;
}

export default function LoginForm() {
    const [formData, setFormData] = useState<LoginFormProps>({
        usuario: "",
        password: "",
        rememberMe: false
    });

    const [errors, setErrors] = useState<ErrorsProps>({
        usuario: "",
        password: "",
        rememberMe: ""
    });

    // Actualiza el valor del campo mientras el usuario escribe.
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        // Si es checkbox usamos 'checked', si es texto usamos 'value'
        const finalValue = type === "checkbox" ? checked : value;

        // Aquí 'prev' ya no dará error porque TypeScript sabe el tipo correcto
        setFormData((prev) => ({ ...prev, [name]: finalValue }));

        // Limpiamos el error al escribir (excepto si es el checkbox)
        if (type !== "checkbox") {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // No validamos en onBlur si es el checkbox
        if (e.target.type !== "checkbox") {
            const error = validateVestoField(name, value);
            // Reemplazar any por el tipo que es.
            setErrors((prev) => ({ ...prev, [name]: error }));
        }
    };

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        // Validamos antes de enviar
        const newErrors = {
            usuario: validateVestoField("usuario", formData.usuario),
            password: validateVestoField("password", formData.password),
            rememberMe: validateVestoField("rememberMe", formData.rememberMe)
        };
        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(Boolean);

        if (!hasErrors) {
            await userRepository.loginUser();
            alert("Iniciando sesión...");
        }
    };

    return (
        <div className="py-5 px-7.5 max-w-md mx-auto bg-white border-2 border-auxiliary-700 rounded-2xl shadow-xl">
            <h3 className="text-center mb-8">Login</h3>

            <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4">
                <Input
                    label={"Nombre de usuario "}
                    name="usuario"
                    type="text"
                    value={formData.usuario}
                    autoComplete="off"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.usuario}
                >
                </Input>
                <Input
                    label={"Contraseña "}
                    name="password"
                    type="password"
                    value={formData.password}
                    autoComplete="off"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.password}
                >
                </Input>
                <Input
                    label={"Recuérdame "}
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.rememberMe}
                >
                </Input>

                <Button type="submit" className="btn btn-primary">Acceder</Button>
            </form>
        </div>
    );
}