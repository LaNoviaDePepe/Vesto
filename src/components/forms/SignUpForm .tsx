import { useState, type ChangeEvent, type FocusEvent } from "react";
import { validateVestoField } from "../../utils/regex";
import Button from "../common/Button";
import type { RegisterData } from "../../interfaces/RegisterData";
import Input from "../common/Input";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { isEmailTaken } from "../../database/supabase/RPCs/isEmailTaken";

interface SignUpFormProps {
    nombreApellidos: string;
    email: string;
    password: string;
    verifPassword: string;
    acceptTerms: boolean;
}

interface ErrorsProps {
    nombreApellidos: string;
    email: string;
    password: string;
    verifPassword: string;
    acceptTerms: string;
}

export default function SignUpForm() {
    const { register, loading, error: authError } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<SignUpFormProps>({
        nombreApellidos: "",
        email: "",
        password: "",
        verifPassword: "",
        acceptTerms: false
    });

    const [errors, setErrors] = useState<ErrorsProps>({
        nombreApellidos: "",
        email: "",
        password: "",
        verifPassword: "",
        acceptTerms: ""
    });

    // Actualiza el valor del campo mientras el usuario escribe.
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    // Valida el campo cuando el usuario sale de él (pierde el foco).
    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let error = "";
        if (name === "verifPassword") {
            error = validateVestoField(name, value, formData.password);
        } else {
            error = validateVestoField(name, value);
        }
        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    const handleEmailBlur = async (e: FocusEvent<HTMLInputElement>) => {
        const error = validateVestoField("email", e.target.value);
        setErrors((prev) => ({ ...prev, email: error }));
        if (error) return;

        const taken = await isEmailTaken(e.target.value);
        if (taken) {
            setErrors((prev) => ({ ...prev, email: "Este correo electrónico ya está registrado" }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => { // Async
        e.preventDefault();

        const newErrors = {
            nombreApellidos: validateVestoField("nombreApellidos", formData.nombreApellidos),
            email: validateVestoField("email", formData.email),
            password: validateVestoField("password", formData.password),
            verifPassword: validateVestoField("verifPassword", formData.verifPassword, formData.password),
            acceptTerms: formData.acceptTerms ? "" : "Debes aceptar los términos y condiciones"
        };
        setErrors(newErrors as any);

        const hasErrors = Object.values(newErrors).some(Boolean);

        if (!hasErrors) {
            // Preparamos los datos
            const newUser: RegisterData = {
                email: formData.email,
                password: formData.password,
                nombre_apellidos: formData.nombreApellidos,
                rol: "user",
                url_avatar: ""
            };

            // Llamamos a register desde el hook
            const success = await register(newUser);

            if (success) {
                alert("Usuario registrado y logueado ✅");
                navigate('/');
            }
        }
    };

    return (
        <div className="py-5 px-7.5 max-w-md mx-auto bg-white border-2 border-auxiliary-700 rounded-2xl shadow-xl">
            <h3 className="text-center mb-8">Registro</h3>

            {/* Mostrar errores de Supabase */}
            {authError && (
                <div className="bg-red-100 text-red-600 p-2 mb-4 rounded text-center text-sm">
                    {authError}
                </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-8">

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
                    onBlur={handleEmailBlur}
                    error={errors.email}
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

                <Button type="submit" disabled={loading} className="btn btn-primary w-full">
                    {loading ? "Registrando..." : "Dar de alta"}
                </Button>
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