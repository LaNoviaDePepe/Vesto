import { useState, type ChangeEvent, type FocusEvent } from "react";
import { validateVestoField } from "../../utils/regex";
import Button from "../common/Button";
import Input from "../common/Input";
import { SupabaseUserRepository } from "../../database/supabase/SupabaseUserRepository";
import { toast } from "react-hot-toast";
import { isEmailTaken } from "../../database/supabase/RPCs/isEmailTaken";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";

/**
 * Interfaz que define los campos del formulario de inicio de sesión.
 */
interface LoginFormProps {
    email: string;
    password: string;
    rememberMe: boolean;
}

/**
 * Interfaz que define los posibles errores de validación del formulario de login.
 */
interface ErrorsProps {
    email: string;
    password: string;
    rememberMe: string;
}

/**
 * Componente `LoginForm`.
 * * Gestiona el inicio de sesión de los usuarios. Valida las credenciales ingresadas,
 * maneja la recuperación de contraseñas olvidadas y actualiza el estado global de
 * autenticación tras un inicio de sesión exitoso.
 * * @returns {JSX.Element} El componente del formulario de inicio de sesión.
 */
export default function LoginForm() {
    // Instanciamos Repositorio, Store y Navegación
    const userRepository = new SupabaseUserRepository();
    const setSession = useAuthStore((state) => state.setSession);
    const navigate = useNavigate();

    // Estados locales para la UI que antes estaban en useAuth
    const [loading, setLoading] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

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

    /**
     * Actualiza el estado del formulario conforme el usuario escribe o interactúa.
     * Soporta tanto inputs de texto como checkboxes.
     * * @param {ChangeEvent<HTMLInputElement>} e - Evento de cambio del input.
     */
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === "checkbox" ? checked : value;
        setFormData((prev) => ({ ...prev, [name]: finalValue }));
        if (type !== "checkbox") {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    /**
     * Ejecuta la validación de un campo específico cuando el usuario pierde el foco.
     * * @param {FocusEvent<HTMLInputElement>} e - Evento de pérdida de foco.
     */
    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (e.target.type !== "checkbox") {
            const error = validateVestoField(name, value);
            setErrors((prev) => ({ ...prev, [name]: error }));
        }
    };

    /**
     * Inicia el proceso de recuperación de contraseña.
     * Verifica que el email sea válido y exista en la base de datos antes de enviar el enlace.
     */
    const handleForgotPassword = async () => {
        const emailError = validateVestoField("email", formData.email);

        if (!formData.email || emailError) {
            toast.error("Introduce un email válido para recuperar tu cuenta");
            setErrors(prev => ({ ...prev, email: emailError || "Email requerido" }));
            return;
        }

        // Usamos formData.email en lugar de e.target.value
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

    /**
     * Maneja el envío del formulario de inicio de sesión.
     * Realiza las validaciones finales y autentica al usuario contra Supabase.
     * * @param {React.FormEvent} e - Evento de envío del formulario.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError(null); // Reseteamos errores previos

        const newErrors = {
            email: validateVestoField("email", formData.email),
            password: validateVestoField("password", formData.password),
            rememberMe: ""
        };
        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(Boolean);

        if (!hasErrors) {
            setLoading(true);
            try {
                // Llamamos directamente al Repositorio
                const { data, isAdmin, error: repoError } = await userRepository.login(formData.email, formData.password);

                if (repoError) {
                    setAuthError(repoError.message || 'Error al iniciar sesión');
                } else if (data) {
                    setSession(data, isAdmin || false); // Guardamos en Zustand
                    toast.success('¡Bienvenido!');
                    navigate(isAdmin ? '/admin/dashboard' : '/closet');
                }
            } catch (err) {
                setAuthError('Error inesperado');
            } finally {
                setLoading(false);
            }
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
                    label={t('form.remember_me')}
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