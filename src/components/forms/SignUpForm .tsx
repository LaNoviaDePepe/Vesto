import { useState, type ChangeEvent, type FocusEvent } from "react";
import { validateVestoField } from "../../utils/regex";
import Button from "../common/Button";
import InputFieldClase from "./InputFieldClase";
import type { RegisterData } from "../../interfaces/RegisterData";
import { createUserRepository } from "../../database/repositories/repositories";

const userRepository = createUserRepository();

interface SignUpFormProps {
    nombreApellidos: string;
    email: string;
    usuario: string;
    password: string;
    verifPassword: string;
}

interface ErrorsProps {
    nombreApellidos: string;
    email: string;
    usuario: string;
    password: string;
    verifPassword: string;
}

export default function SignUpForm() {
    const [formData, setFormData] = useState<SignUpFormProps>({
        nombreApellidos: "",
        email: "",
        usuario: "",
        password: "",
        verifPassword: ""
    });

    const [errors, setErrors] = useState<ErrorsProps>({
        nombreApellidos: "",
        email: "",
        usuario: "",
        password: "",
        verifPassword: ""
    });

    // Actualiza el valor del campo mientras el usuario escribe.
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    // Valida el campo cuando el usuario sale de él (pierde el foco).
    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let error = "";

        // Solo para verifPassword pasamos la contraseña
        if (name === "verifPassword") {
            error = validateVestoField(name, value, formData.password);
        } else {
            error = validateVestoField(name, value);
        }
        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        const newErrors = {
            nombreApellidos: validateVestoField("nombreApellidos", formData.nombreApellidos),
            email: validateVestoField("email", formData.email),
            usuario: validateVestoField("usuario", formData.usuario),
            password: validateVestoField("password", formData.password),
            verifPassword: validateVestoField("verifPassword", formData.verifPassword, formData.password)
        };
        setErrors(newErrors);

        // Comprueba si hay algún valor en el array newErrors (true si hay alguno)
        const hasErrors = Object.values(newErrors).some(Boolean);
        if (!hasErrors) {
            alert("Formulario válido ✅");
            const newUser: RegisterData = {
                email: formData.email,
                password: formData.password,
                username: formData.usuario,
                full_name: formData.nombreApellidos,
                role: "user",
                avatar_url: ""
            }
            userRepository.createUser(newUser);

        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4">

            <InputFieldClase
                label={"Nombre y apellidos"}
                name="nombreApellidos"
                type="text"
                value={formData.nombreApellidos}
                autoComplete="off"
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.nombreApellidos}
            >
            </InputFieldClase>
            <InputFieldClase
                label={"Email"}
                name="email"
                type="email"
                value={formData.email}
                autoComplete="off"
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
            >
            </InputFieldClase>
            <InputFieldClase
                label={"Usuario"}
                name="usuario"
                type="text"
                value={formData.usuario}
                autoComplete="off"
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.usuario}
            >
            </InputFieldClase>
            <InputFieldClase
                label={"password"}
                name="password"
                type="password"
                value={formData.password}
                autoComplete="off"
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.password}
            >
            </InputFieldClase>
            <InputFieldClase
                label={"Repite contraseña"}
                name="verifPassword"
                type="password"
                value={formData.verifPassword}
                autoComplete="off"
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.verifPassword}
            >
            </InputFieldClase>

            <Button type="submit">Enviar</Button>
        </form>
    );
}