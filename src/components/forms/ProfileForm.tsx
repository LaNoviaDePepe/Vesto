import { useState, useEffect, type ChangeEvent, type FocusEvent } from "react";
import { validateVestoField } from "../../utils/regex";
import Button from "../common/Button";
import Input from "../common/Input";
import toast from "react-hot-toast";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";
import { SupabaseUserRepository } from "../../database/supabase/SupabaseUserRepository";
import { useTranslation } from "react-i18next";
    
/**
 * Interfaz que define los datos editables del perfil de usuario.
 */
interface UserProfileProps { nombreApellidos: string; email: string; currentPassword: string; newPassword: string; avatar: File | null; }

/**
 * Interfaz que define los errores de validación del formulario de perfil.
 */
interface ErrorsProps { nombreApellidos: string; email: string; currentPassword: string; newPassword: string; avatar: string; }

/**
 * Componente `ProfileForm`.
 * * Permite al usuario autenticado visualizar y actualizar sus datos, contraseña y avatar.
 * * Adaptado con diseño responsivo y compatibilidad de colores para Modo Oscuro.
 * @returns {JSX.Element} Componente renderizado para la gestión del perfil.
 */
export default function ProfileForm() {
    const { t } = useTranslation();
    const state = useAuthStore();
    const userRepository = new SupabaseUserRepository();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<UserProfileProps>({ nombreApellidos: "", email: "", currentPassword: "", newPassword: "", avatar: null });
    const [errors, setErrors] = useState<ErrorsProps>({ nombreApellidos: "", email: "", currentPassword: "", newPassword: "", avatar: "" });
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    /**
     * Hook que carga los datos iniciales del usuario basados en la sesión.
     */
    useEffect(() => {
        const session = state.sessionUser;
        if (session?.user && session?.profile) {
            setFormData(prev => ({ ...prev, nombreApellidos: session.profile?.nombre_apellidos ?? "", email: session.user.email || "" }));
            if (session.profile.url_avatar) setPreview(session.profile.url_avatar);
        }
    }, [state.sessionUser]);

    /**
     * Cierra la sesión del usuario y redirige al home.
     */
    const handleLogout = async () => {
        setLoading(true);
        const result = await userRepository.logout();
        if (result.error) toast.error(t('error.close_session'));
        state.clearSession();
        setLoading(false);
        navigate('/');
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof ErrorsProps]) setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if ((name === "newPassword" || name === "currentPassword") && value.length > 0) {
            const error = validateVestoField("password", value);
            setErrors((prev) => ({ ...prev, [name]: error }));
        } else if (name !== "avatar" && name !== "newPassword" && name !== "currentPassword") {
            const error = validateVestoField(name, value);
            setErrors((prev) => ({ ...prev, [name]: error }));
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 2 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, avatar: t('message.2MB') }));
                return;
            }
            setFormData((prev) => ({ ...prev, avatar: file }));
            setPreview(URL.createObjectURL(file));
            setErrors((prev) => ({ ...prev, avatar: "" }));
        }
    };

    /**
     * Envía los datos actualizados del perfil al backend (Supabase).
     * @param {React.FormEvent<HTMLFormElement>} e - Evento de envío.
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const cleanNombre = formData.nombreApellidos.trim();
        const newErrors = {
            nombreApellidos: validateVestoField("nombreApellidos", cleanNombre),
            currentPassword: (formData.newPassword && !formData.currentPassword) ? t('form.required_to_change_password') : "",
            newPassword: formData.newPassword ? validateVestoField("password", formData.newPassword) : "",
            email: "", avatar: ""
        };

        setErrors(newErrors);
        if (Object.values(newErrors).some(err => err !== "")) return;

        setLoading(true);
        const userId = state.sessionUser?.user.id;

        try {
            let avatarUrl = undefined;
            if (formData.avatar) {
                const uploadRes = await userRepository.updateAvatar(userId!, formData.avatar);
                avatarUrl = uploadRes.data;
            }
            const updateData = { nombre_apellidos: cleanNombre, currentPassword: formData.currentPassword || undefined, newPassword: formData.newPassword || undefined, avatarUrl: avatarUrl };
            const profileRes = await userRepository.updateProfile(userId!, updateData);
            if (profileRes.error) throw new Error(profileRes.error.message);

            if (state.updateSessionProfile) state.updateSessionProfile(profileRes.data);
            toast.success(t('message.profile_updated'));
            setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "" }));
        } catch (error: any) {
            toast.error(error.message || t('error.saving'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mb-10 py-8 px-8 max-w-5xl lg:mx-auto mx-5 bg-white dark:bg-gray-900 border-2 border-auxiliary-700 dark:border-gray-700 rounded-2xl shadow-xl dark:shadow-none transition-colors duration-300">
            <h3 className="text-3xl text-center mb-10 font-medium text-gray-800 dark:text-white transition-colors duration-300">{t('form.user_profile')}</h3>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-5 flex flex-col items-center pt-4">
                    <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg bg-gray-100 dark:bg-gray-800 mb-6 relative group transition-colors duration-300">
                        {preview ? (
                            <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-[#2B526A] dark:bg-gray-700 flex items-end justify-center transition-colors duration-300">
                                <svg className="w-48 h-48 text-[#EABF9F] dark:text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                            </div>
                        )}
                    </div>

                    <div className="w-full max-w-xs">
                        <input
                            type="file" name="avatar" accept="image/*" onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-2 file:border-gray-300 dark:file:border-gray-600 file:text-sm file:font-semibold file:bg-white dark:file:bg-gray-800 file:text-gray-700 dark:file:text-gray-300 hover:file:bg-gray-50 dark:hover:file:bg-gray-700 cursor-pointer transition-colors duration-300"
                        />
                        {errors.avatar && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.avatar}</p>}
                    </div>
                </div>

                <div className="md:col-span-7 space-y-6">
                    <Input label={t('form.name_surname')} name="nombreApellidos" type="text" value={formData.nombreApellidos} onChange={handleChange} onBlur={handleBlur} error={errors.nombreApellidos} />
                    <Input label="Email" name="email" type="email" autoComplete="off" value={formData.email} disabled={true} />

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
                        <div className="space-y-6">
                            <Input label={t('form.current_password')} name="currentPassword" type="password" value={formData.currentPassword} placeholder={t('form.required_to_change_password')} autoComplete="current-password" onChange={handleChange} onBlur={handleBlur} error={errors.currentPassword} />
                            <Input label={t('form.new_password')} name="newPassword" type="password" value={formData.newPassword} placeholder={t('form.write_new_password')} autoComplete="new-password" onChange={handleChange} onBlur={handleBlur} error={errors.newPassword} />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 pt-4 mt-8">
                        <Button type="submit" variant="primary" disabled={loading}>{loading ? t('actions.saving') : t('actions.save_changes')}</Button>
                        <Button type="button" variant="auxiliar" onClick={handleLogout} disabled={loading}>{t('actions.logout')}</Button>
                    </div>
                </div>
            </form>
        </div>
    );
}