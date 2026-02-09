import { useState, type ChangeEvent, type FocusEvent } from "react";
import { validateVestoField } from "../../utils/regex";
import Button from "../common/Button";
import type { RegisterData } from "../../interfaces/RegisterData";
import { createUserRepository } from "../../database/repositories/repositories";
import Input from "../common/Input";
import { Link } from "react-router-dom";

const userRepository = createUserRepository();

interface SignUpFormProps {
    nombreApellidos: string;
    email: string;
    usuario: string;
    password: string;
    verifPassword: string;
    acceptTerms: boolean;
}

interface ErrorsProps {
    nombreApellidos: string;
    email: string;
    usuario: string;
    password: string;
    verifPassword: string;
    acceptTerms: string;
}

export default function SignUpForm() {
    const [formData, setFormData] = useState<SignUpFormProps>({
        nombreApellidos: "",
        email: "",
        usuario: "",
        password: "",
        verifPassword: "",
        acceptTerms: false
    });

    const [errors, setErrors] = useState<ErrorsProps>({
        nombreApellidos: "",
        email: "",
        usuario: "",
        password: "",
        verifPassword: "",
        acceptTerms: ""
    });

    // Actualiza el valor del campo mientras el usuario escribe.
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value // Lógica para checkbox
        }));

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
            verifPassword: validateVestoField("verifPassword", formData.verifPassword, formData.password),
            // Validación manual del checkbox
            acceptTerms: formData.acceptTerms ? "" : "Debes aceptar los términos y condiciones"
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
        <div className="py-5 px-7.5 max-w-md mx-auto bg-white border-2 border-auxiliary-700 rounded-2xl shadow-xl">
            <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-8">
                <h3>Registro</h3>
                <Input
                    label={"Nombre y apellidos"}
                    name="nombreApellidos"
                    type="text"
                    value={formData.nombreApellidos}
                    autoComplete="off"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.nombreApellidos}
                >
                </Input>
                <Input
                    label={"Email"}
                    name="email"
                    type="email"
                    value={formData.email}
                    autoComplete="off"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.email}
                >
                </Input>
                <Input
                    label={"Usuario"}
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
                    label={"password"}
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
                    label={"Repite contraseña"}
                    name="verifPassword"
                    type="password"
                    value={formData.verifPassword}
                    autoComplete="off"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.verifPassword}
                />
                <Input
                    label="Acepto los términos y condiciones"
                    name="acceptTerms"
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    error={errors.acceptTerms}
                />

                <Button type="submit" className="btn btn-primary">Dar de alta</Button>
                <p className="mt-8 text-start text-sm text-gray-600">
                    ¿Ya tienes una cuenta? Ingresa{" "}
                    <Link to="/login" className="text-primary-500 text-sm hover:underline hover:text-primary-700 hover:font-semibold">
                        aquí
                    </Link>
                </p>
            </form>
        </div >
    );
}