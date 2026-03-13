import { useState, type ChangeEvent, type FocusEvent } from "react";
import { validateVestoField } from "../../utils/regex";
import Button from "../common/Button";
import Input from "../common/Input";
import { SupabaseUserRepository } from "../../database/supabase/SupabaseUserRepository";
import { toast } from "react-hot-toast";
import { isEmailTaken } from "../../database/supabase/RPCs/isEmailTaken";
import { useAuthStore } from "../../stores/authStore";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

/**
 * Interfaz que define los campos del formulario de inicio de sesión.
 */
interface LoginFormProps { email: string; password: string; }

/**
 * Interfaz que define los posibles errores de validación del formulario de login.
 */
interface ErrorsProps { email: string; password: string; }

/**
 * Componente `LoginForm`.
 * * Gestiona el inicio de sesión de los usuarios. Valida las credenciales ingresadas,
 * maneja la recuperación de contraseñas olvidadas y actualiza el estado global de
 * autenticación tras un inicio de sesión exitoso.
 * * Totalmente adaptado al Modo Oscuro con clases dinámicas de Tailwind.
 * * @returns {JSX.Element} El componente del formulario de inicio de sesión.
 */
export default function LoginForm() {
    const { t } = useTranslation();
    const userRepository = new SupabaseUserRepository();
    const setSession = useAuthStore((state) => state.setSession);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    const [formData, setFormData] = useState<LoginFormProps>({ email: "", password: "" });
    const [errors, setErrors] = useState<ErrorsProps>({ email: "", password: "" });

/**
     * Actualiza el estado del formulario conforme el usuario escribe o interactúa.
     * @param {ChangeEvent<HTMLInputElement>} e - Evento de cambio del input.
     */
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

/**
     * Ejecuta la validación de un campo específico cuando el usuario pierde el foco.
     * @param {FocusEvent<HTMLInputElement>} e - Evento de pérdida de foco.
     */
    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const error = validateVestoField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    /**
     * Inicia el proceso de recuperación de contraseña comprobando el email.
     */
    const handleForgotPassword = async () => {
        const emailError = validateVestoField("email", formData.email);
        if (!formData.email || emailError) {
            toast.error(t('form.email_required_recovery'));
            setErrors(prev => ({ ...prev, email: emailError || t('form.email_required') }));
            return;
        }

        const taken = await isEmailTaken(formData.email);
        if (!taken) {
            toast.error(t('form.email_not_registered'));
            setErrors(prev => ({ ...prev, email: t('form.email_not_registered_short') }));
            return;
        }

        const { error } = await userRepository.resetPasswordForEmail(formData.email);
        if (error) {
            toast.error(t('error.recovery_link'));
        } else {
            toast.success(t('message.recovery_link_sent', { email: formData.email }), { duration: 6000, icon: '📧' });
        }
    };

    /**
     * Maneja el envío del formulario de inicio de sesión.
     * @param {React.FormEvent} e - Evento de envío del formulario.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError(null);

        const newErrors = {
            email: validateVestoField("email", formData.email),
            password: validateVestoField("password", formData.password),
        };
        setErrors(newErrors);

        if (!Object.values(newErrors).some(Boolean)) {
            setLoading(true);
            try {
                const { data, isAdmin, error: repoError } = await userRepository.login(formData.email, formData.password);
                if (repoError) {
                    setAuthError(repoError.message || t('error.login'));
                } else if (data) {
                    setSession(data, isAdmin || false);
                    toast.success(t('message.welcome_login'));
                    navigate(isAdmin ? '/admin/dashboard' : '/closet');
                }
            } catch (err) {
                setAuthError(t('error.random_error'));
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="max-w-77.5 mx-auto sm:max-w-md py-5 px-4 sm:px-6 md:px-8 bg-white dark:bg-gray-900 border-2 border-auxiliary-700 dark:border-gray-700 rounded-2xl shadow-xl dark:shadow-none transition-colors duration-300">
            <h3 className="text-center mb-8 text-gray-900 dark:text-white transition-colors duration-300">{t('form.login_title')}</h3>

            {authError && (
                <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-2 mb-4 rounded text-center text-sm transition-colors duration-300">
                    {authError}
                </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4">
                <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} error={errors.email} placeholder={t('form.email_placeholder')} />

                <div className="flex flex-col">
                    <Input label={t('form.password')} name="password" type="password" value={formData.password} onChange={handleChange} onBlur={handleBlur} error={errors.password} placeholder="••••••••" />
                    <div className="flex justify-end mt-1">
                        <button type="button" onClick={handleForgotPassword} className="text-[11px] text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 underline transition-colors font-medium">
                            {t('form.forgot_password')}
                        </button>
                    </div>
                </div>

                <Button type="submit" disabled={loading} className="btn btn-primary w-full mt-4">
                    {loading ? t('actions.loading') : t('actions.access')}
                </Button>
                <p className="mt-8 text-start text-sm text-gray-600">
                    {t('form.does_not_have_account')}{" "}
                    <Link to="/signup" className="text-primary-500 text-sm hover:underline hover:text-primary-700 hover:font-semibold">
                        {t('form.here')}
                    </Link>
                </p>
            </form>
        </div>
    );
}