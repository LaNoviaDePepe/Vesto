import { useState, useEffect, type ChangeEvent, type FocusEvent } from "react";
import { validateVestoField } from "../../utils/regex";
import Button from "../common/Button";
import Input from "../common/Input";
import toast from "react-hot-toast";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";
import { SupabaseUserRepository } from "../../database/supabase/SupabaseUserRepository";

interface UserProfileProps {
    nombreApellidos: string;
    email: string;
    currentPassword: string;
    newPassword: string;
    avatar: File | null;
}

interface ErrorsProps {
    nombreApellidos: string;
    email: string;
    currentPassword: string;
    newPassword: string;
    avatar: string;
}

/**
 * Formulario de gestión de perfil de usuario.
 * * Este componente permite al usuario autenticado:
 * - Visualizar sus datos actuales (Nombre, Email, Avatar).
 * - Actualizar su información personal.
 * - Cambiar su contraseña (requiere validación de la contraseña actual).
 * - Subir una nueva imagen de perfil con previsualización.
 * * Gestiona la validación de campos en tiempo real y la comunicación con
 * Supabase a través de `SupabaseUserRepository`.
 */
export default function ProfileForm() {

    const state = useAuthStore();
    // Instancia correcta del repositorio
    const userRepository = new SupabaseUserRepository();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<UserProfileProps>({
        nombreApellidos: "",
        email: "",
        currentPassword: "",
        newPassword: "",
        avatar: null
    });

    const [errors, setErrors] = useState<ErrorsProps>({
        nombreApellidos: "",
        email: "",
        currentPassword: "",
        newPassword: "",
        avatar: ""
    });

    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // CARGAR DATOS DEL USUARIO
    useEffect(() => {
        const session = state.sessionUser;
        if (session?.user && session?.profile) {
            setFormData(prev => ({
                ...prev,
                nombreApellidos: session.profile?.nombre_apellidos ?? "",
                email: session.user.email || "",
            }));
            if (session.profile.url_avatar) {
                setPreview(session.profile.url_avatar);
            }
        }
    }, [state.sessionUser]);

    /**
     * Gestiona el cierre de sesión del usuario llamando al repositorio
     * y limpiando el estado global.
     */
    const handleLogout = async () => {
        setLoading(true);
        const result = await userRepository.logout();
        if (result.error) toast.error('Error al cerrar sesión');
        state.clearSession();
        setLoading(false);
        navigate('/');
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof ErrorsProps]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Validación específica para contraseñas
        if ((name === "newPassword" || name === "currentPassword") && value.length > 0) {
            // Puedes usar una validación simple o tu validateVestoField si soporta passwords
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
                setErrors(prev => ({ ...prev, avatar: "La imagen debe pesar menos de 2MB" }));
                return;
            }
            setFormData((prev) => ({ ...prev, avatar: file }));
            setPreview(URL.createObjectURL(file));
            setErrors((prev) => ({ ...prev, avatar: "" }));
        }
    };

    /**
     * Envía los datos del formulario.
     * Realiza validaciones finales y decide qué datos enviar al repositorio
     * basándose en los cambios realizados.
     */
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        // VALIDACIONES
        const newErrors = {
            nombreApellidos: validateVestoField("nombreApellidos", formData.nombreApellidos),
            email: validateVestoField("email", formData.email),
            // Validamos currentPassword solo si hay newPassword
            currentPassword: (formData.newPassword && !formData.currentPassword) ? "Debes ingresar tu contraseña actual" : "",
            newPassword: formData.newPassword ? validateVestoField("password", formData.newPassword) : "",
            avatar: ""
        };

        setErrors(newErrors);
        if (Object.values(newErrors).some((err) => err !== "")) {
            toast.error("Por favor, revisa los errores");
            return;
        }

        setLoading(true);
        const userId = state.sessionUser?.user.id;

        if (!userId) {
            toast.error("Sesión no válida");
            setLoading(false);
            return;
        }

        try {
            let avatarUrl = undefined;

            if (formData.avatar) {
                const uploadRes = await userRepository.updateAvatar(userId, formData.avatar);
                if (uploadRes.error) throw new Error("Error imagen: " + uploadRes.error.message);
                avatarUrl = uploadRes.data;
            }

            // ENVIAMOS DATOS AL REPO
            const updateData = {
                nombre_apellidos: formData.nombreApellidos,
                email: formData.email,
                currentPassword: formData.currentPassword || undefined, // Enviamos la actual
                newPassword: formData.newPassword || undefined,         // Enviamos la nueva
                avatarUrl: avatarUrl
            };

            const profileRes = await userRepository.updateProfile(userId, updateData);

            if (profileRes.error) throw new Error(profileRes.error.message);

            // ACTUALIZAR STORE
            if (state.updateSessionProfile) {
                state.updateSessionProfile(profileRes.data);
            }
            if (state.updateSessionUser && formData.email !== state.sessionUser?.user.email) {
                state.updateSessionUser({ email: formData.email });
                toast("Verifica tu correo si has cambiado el email.", { icon: '📧' });
            }

            toast.success("Perfil actualizado correctamente ✅");
            // Limpiamos campos de contraseña
            setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "" }));

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Error al guardar");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-8 px-8 max-w-5xl mx-auto bg-white border-2 border-auxiliary-700 rounded-2xl shadow-xl">
            <h3 className="text-3xl text-center mb-10 font-medium text-gray-800">Perfil de Usuario</h3>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-7 space-y-6">
                    <Input
                        label="Nombre y Apellidos"
                        name="nombreApellidos"
                        type="text"
                        value={formData.nombreApellidos}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.nombreApellidos}
                    />

                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.email}
                    />

                    {/* SECCIÓN DE SEGURIDAD VISUALMENTE SEPARADA */}
                    <div className="pt-4 border-t border-gray-200">

                        <div className="space-y-6">
                            <Input
                                label="Contraseña Actual"
                                name="currentPassword"
                                type="password"
                                value={formData.currentPassword}
                                placeholder="Requerida para cambiar la contraseña"
                                autoComplete="current-password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.currentPassword}
                            />

                            <Input
                                label="Nueva contraseña"
                                name="newPassword"
                                type="password"
                                value={formData.newPassword}
                                placeholder="Escribe nueva contraseña"
                                autoComplete="new-password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.newPassword}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4 mt-8">
                        <Button type="submit" variant="primary" disabled={loading}>
                            {loading ? "Guardando..." : "Guardar cambios"}
                        </Button>
                        <Button
                            type="button" variant="auxiliar"
                            onClick={handleLogout}
                            disabled={loading}
                        >
                            Cerrar sesión
                        </Button>
                    </div>
                </div>

                <div className="md:col-span-5 flex flex-col items-center pt-4">
                    <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 mb-6 relative group">
                        {preview ? (
                            <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-[#2B526A] flex items-end justify-center">
                                <svg className="w-48 h-48 text-[#EABF9F]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                            </div>
                        )}
                    </div>

                    <div className="w-full max-w-xs">
                        <input
                            type="file"
                            name="avatar"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-2 file:border-gray-300 file:text-sm file:font-semibold file:bg-white file:text-gray-700 hover:file:bg-gray-50 cursor-pointer"
                        />
                        {errors.avatar && <p className="mt-2 text-sm text-red-600">{errors.avatar}</p>}
                    </div>
                </div>
            </form>
        </div>
    );
}