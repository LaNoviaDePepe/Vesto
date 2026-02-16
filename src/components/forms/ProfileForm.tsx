import { useState, useEffect, type ChangeEvent, type FocusEvent } from "react";
import { validateVestoField } from "../../utils/regex";
import Button from "../common/Button";
import Input from "../common/Input";
import toast from "react-hot-toast";
import { useAuthStore } from "../../stores/authStore";
import { createUserRepository } from "../../database/repositories";
import { useNavigate } from "react-router-dom";

// Interfaz para los datos del formulario
interface UserProfileProps {
    nombreApellidos: string;
    email: string;
    password: string;
    newPassword: string;
    avatar: File | null;
}

// Interfaz para los errores
interface ErrorsProps {
    nombreApellidos: string;
    email: string;
    password: string;
    newPassword: string;
    avatar: string;
}

export default function ProfileForm() {

    const state = useAuthStore();
    const userRepository = createUserRepository();
    const navigate = useNavigate();

    // Estado del formulario
    const [formData, setFormData] = useState<UserProfileProps>({
        nombreApellidos: "",
        email: "",
        password: "",
        newPassword: "",
        avatar: null
    });

    // Estado de errores
    const [errors, setErrors] = useState<ErrorsProps>({
        nombreApellidos: "",
        email: "",
        password: "",
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
                nombreApellidos: session?.profile?.nombre_apellidos || "", email: session.user.email || "",
                password: "",
                newPassword: ""
            }));

            // Si ya tiene avatar guardado, lo mostramos
            if (session.profile.url_avatar) {
                setPreview(session.profile.url_avatar);
            }
        }
    }, [state.sessionUser]);

    const handleLogout = async () => {
        try {
            const result = await userRepository.logout();
            if (result.error) {
                toast.error('Error al cerrar sesión');
                return;
            }
            state.clearSession();
            navigate('/');
        } catch (error) {
            toast.error('Ocurrió un error inesperado');
            console.log(error);
        }
    }

    // Maneja cambios en Inputs de texto
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    // Validación al perder el foco (Blur)
    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === "newPassword" && value.length > 0) {
            const error = validateVestoField("password", value);
            setErrors((prev) => ({ ...prev, [name]: error }));
        } else if (name !== "avatar" && name !== "newPassword") {
            const error = validateVestoField(name, value);
            setErrors((prev) => ({ ...prev, [name]: error }));
        }
    };

    // Maneja la subida de imagen (Preview local)
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData((prev) => ({ ...prev, avatar: file }));
            setPreview(URL.createObjectURL(file)); // Crea URL temporal
            setErrors((prev) => ({ ...prev, avatar: "" }));
        }
    };

    // ENVIO DEL FORMULARIO 
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validaciones
        const newErrors = {
            nombreApellidos: validateVestoField("nombreApellidos", formData.nombreApellidos),
            email: validateVestoField("email", formData.email),
            password: "",
            newPassword: "",
            avatar: ""
        };

        if (formData.newPassword) {
            newErrors.newPassword = validateVestoField("password", formData.newPassword);
        }

        setErrors(newErrors as ErrorsProps);
        const hasErrors = Object.values(newErrors).some((err) => err !== "");

        if (hasErrors) {
            toast.error("Por favor, revisa los errores del formulario");
            return;
        }

        // COMIENZA EL PROCESO DE GUARDADO
        setLoading(true);
        const userId = state.sessionUser?.user.id;

        if (!userId) {
            toast.error("Error: No se encuentra la sesión del usuario.");
            setLoading(false);
            return;
        }

        try {
            let avatarUrl = undefined;

            // Subir Avatar (Solo si hay un archivo nuevo seleccionado)
            if (formData.avatar) {
                const uploadRes = await userRepository.updateAvatar(userId, formData.avatar);
                if (uploadRes.error) {
                    throw new Error("Error al subir la imagen: " + uploadRes.error.message);
                }
                avatarUrl = uploadRes.data;
            }

            // Actualizar Perfil y Password
            const updateData = {
                nombre: formData.nombreApellidos,
                email: formData.email,
                password: formData.newPassword || undefined, // Solo envía si hay pass nueva
                avatarUrl: avatarUrl // Envía la URL si se subió nueva
            };

            const profileRes = await userRepository.updateProfile(userId, updateData);

            if (profileRes.error) {
                throw new Error(profileRes.error.message || "Error al actualizar perfil");
            }

            // Actualizar el Store Global (Para ver cambios sin recargar)
            if (state.updateSessionProfile) {
                state.updateSessionProfile(profileRes.data);
            }

            toast.success("Cambios guardados correctamente ✅");

            // Limpiamos el campo de nueva contraseña tras guardar
            setFormData(prev => ({ ...prev, newPassword: "" }));

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Ocurrió un error al guardar");
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
                        autoComplete="name"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.nombreApellidos}
                    />

                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        autoComplete="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.email}
                    // Si no quieres permitir cambiar email, añade: disabled={true}
                    />

                    <Input
                        label="Contraseña (Opcional si cambias datos)"
                        name="password"
                        type="password"
                        value={formData.password}
                        placeholder="Solo requerida en algunos casos"
                        autoComplete="current-password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.password}
                    />

                    <Input
                        label="Nueva contraseña (Opcional)"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        placeholder="Rellena solo para cambiarla"
                        autoComplete="new-password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.newPassword}
                    />

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
                    {/* Contenedor Circular del Avatar */}
                    <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 mb-6 relative group">
                        {preview ? (
                            <img
                                src={preview}
                                alt="Avatar usuario"
                                className="w-full h-full object-cover"
                            />
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
                            className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-2 file:border-gray-300
                                file:text-sm file:font-semibold
                                file:bg-white file:text-gray-700
                                hover:file:bg-gray-50
                                cursor-pointer"
                        />
                        {errors.avatar && <p className="mt-2 text-sm text-red-600">{errors.avatar}</p>}
                    </div>

                </div>

            </form>
        </div>
    );
}