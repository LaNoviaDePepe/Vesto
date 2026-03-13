import { useState, type ChangeEvent, type FocusEvent } from "react";
import { validateVestoField } from "../../utils/regex";
import Button from "../common/Button";
import type { RegisterData } from "../../interfaces/RegisterData";
import Input from "../common/Input";
import { Link, useNavigate } from "react-router-dom";
import { isEmailTaken } from "../../database/supabase/RPCs/isEmailTaken";
import { SupabaseUserRepository } from "../../database/supabase/SupabaseUserRepository";
import { useAuthStore } from "../../stores/authStore";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import TermsModal from "../common/Modal/TermsModal";

/**
 * Interfaz que define los campos requeridos para el registro de usuario.
 */
interface SignUpFormProps { nombreApellidos: string; email: string; password: string; verifPassword: string; acceptTerms: boolean; }

/**
 * Interfaz que define los posibles errores de validación del formulario de registro.
 */
interface ErrorsProps { nombreApellidos: string; email: string; password: string; verifPassword: string; acceptTerms: string; }

/**
 * Componente `SignUpForm`.
 * * Gestiona el formulario de registro para nuevos usuarios. Valida todos los campos,
 * verifica asíncronamente si el email ya existe, crea el usuario en Supabase y actualiza la sesión.
 * * Soporte completo a Modo Oscuro.
 * @returns {JSX.Element} El componente del formulario de registro.
 */
export default function SignUpForm() {
    const { t } = useTranslation();
    const userRepository = new SupabaseUserRepository();
    const setSession = useAuthStore((state) => state.setSession);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const [isTermsOpen, setIsTermsOpen] = useState(false);

    const [formData, setFormData] = useState<SignUpFormProps>({ nombreApellidos: "", email: "", password: "", verifPassword: "", acceptTerms: false });
    const [errors, setErrors] = useState<ErrorsProps>({ nombreApellidos: "", email: "", password: "", verifPassword: "", acceptTerms: "" });

    /**
     * Actualiza el valor del campo en el estado local mientras el usuario escribe.
     * @param {ChangeEvent<HTMLInputElement>} e - Evento de cambio del input.
     */
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    /**
     * Ejecuta la validación del campo cuando el usuario pierde el foco.
     * @param {FocusEvent<HTMLInputElement>} e - Evento de pérdida de foco.
     */
    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let error = name === "verifPassword" ? validateVestoField(name, value, formData.password) : validateVestoField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    /**
     * Validación específica y asíncrona para el campo de email (comprueba existencia en BBDD).
     * @param {FocusEvent<HTMLInputElement>} e - Evento de pérdida de foco en el campo de email.
     */
    const handleEmailBlur = async (e: FocusEvent<HTMLInputElement>) => {
        const error = validateVestoField("email", e.target.value);
        setErrors((prev) => ({ ...prev, email: error }));
        if (error) return;

        const taken = await isEmailTaken(e.target.value);
        if (taken) setErrors((prev) => ({ ...prev, email: t('form.email_taken') }));
    };

    /**
     * Maneja el envío del formulario de registro.
     * @param {React.FormEvent} e - Evento de envío del formulario.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError(null);

        const newErrors: ErrorsProps = {
            nombreApellidos: validateVestoField("nombreApellidos", formData.nombreApellidos) as string,
            email: validateVestoField("email", formData.email) as string,
            password: validateVestoField("password", formData.password) as string,
            verifPassword: validateVestoField("verifPassword", formData.verifPassword, formData.password) as string,
            acceptTerms: formData.acceptTerms ? "" : t('form.accept_terms_error')
        };
        setErrors(newErrors);

        if (!Object.values(newErrors).some(Boolean)) {
            setLoading(true);
            const newUser: RegisterData = { email: formData.email, password: formData.password, nombre_apellidos: formData.nombreApellidos, rol: "user", url_avatar: "" };
            try {
                const { data, error: repoError } = await userRepository.createUser(newUser);
                if (repoError) {
                    setAuthError(repoError.message || t('error.signup'));
                } else if (data) {
                    setSession(data, false);
                    toast.success(t('message.user_registered'));
                    navigate('/');
                }
            } catch (err) {
                setAuthError(t('error.random_error'));
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="max-w-[310px] mx-auto  sm:max-w-md py-5 px-4 sm:px-6 md:px-8 bg-white dark:bg-gray-900 border-2 border-auxiliary-700 dark:border-gray-700 rounded-2xl shadow-xl dark:shadow-none transition-colors duration-300">
            <h3 className="text-center mb-8 text-gray-900 dark:text-white transition-colors duration-300">{t('form.signup_title')}</h3>

            {authError && (
                <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-2 mb-4 rounded text-center text-sm transition-colors duration-300">
                    {authError}
                </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-8">
                <Input label={t('form.name_surname')} name="nombreApellidos" type="text" value={formData.nombreApellidos} autoComplete="off" onChange={handleChange} onBlur={handleBlur} error={errors.nombreApellidos} />
                <Input label="Email" name="email" type="email" value={formData.email} autoComplete="off" onChange={handleChange} onBlur={handleEmailBlur} error={errors.email} />
                <Input label={t('form.password')} name="password" type="password" value={formData.password} autoComplete="off" onChange={handleChange} onBlur={handleBlur} error={errors.password} />
                <Input label={t('form.repeat_password')} name="verifPassword" type="password" value={formData.verifPassword} autoComplete="off" onChange={handleChange} onBlur={handleBlur} error={errors.verifPassword} />
                <Input
                    label={
                        <span className="text-sm inline">
                            {t('form.accept_terms')}
                            <button
                                type="button"
                                onClick={() => setIsTermsOpen(true)}
                                className="px-0 text-primary-500 text-sm hover:underline hover:text-primary-700 dark:hover:text-primary-300 hover:font-semibold hover:shadow-none hover:translate-0 duration-100 inline"
                            >
                                {t('terms.title')}
                            </button>
                        </span>
                    }
                    name="acceptTerms"
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    error={errors.acceptTerms} />

                <Button type="submit" disabled={loading} className="btn btn-primary w-full">
                    {loading ? t('actions.signing_up') : t('actions.signup')}
                </Button>

                <p className="mt-8 text-start text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                    {t('form.already_have_account')}{" "}
                    <Link to="/login" className="text-primary-500 dark:text-primary-400 text-sm hover:underline hover:text-primary-700 dark:hover:text-primary-300 hover:font-semibold transition-colors duration-300">
                        {t('form.here')}
                    </Link>
                </p>
            </form>

            {/* Modal de términos y condiciones */}
            <TermsModal
                isOpen={isTermsOpen}
                onClose={() => setIsTermsOpen(false)}
                showCancel={true}
                onConfirm={() => {
                    setFormData(prev => ({ ...prev, acceptTerms: true }));
                    setIsTermsOpen(false);
                }}
            />
        </div >
    );
}