import { useState, type ChangeEvent, type FocusEvent } from "react";
import { validateVestoField } from "../../utils/regex";
import Button from "../common/Button";
import Input from "../common/Input";

// Interfaz para los datos del formulario
interface UserProfileProps {
    nombreApellidos: string;
    email: string;
    usuario: string;
    password: string;
    newPassword: string;
    avatar: File | null;
}

// Interfaz para los errores
interface ErrorsProps {
    nombreApellidos: string;
    email: string;
    usuario: string;
    password: string;
    newPassword: string;
    avatar: string;
}

export default function ProfileForm() {
    // Estado del formulario
    const [formData, setFormData] = useState<UserProfileProps>({
        nombreApellidos: "Pepito Pérez",
        email: "miemail123@vesto.com",
        usuario: "",
        password: "",
        newPassword: "",
        avatar: null
    });

    // Estado de errores
    const [errors, setErrors] = useState<ErrorsProps>({
        nombreApellidos: "",
        email: "",
        usuario: "",
        password: "",
        newPassword: "",
        avatar: ""
    });

    // Estado para previsualización de imagen (Avatar)
    const [preview, setPreview] = useState<string | null>(null);

    // Maneja cambios en Inputs de texto
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    // Validación al perder el foco (Blur)
    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Validación específica para la nueva contraseña
        if (name === "newPassword" && value.length > 0) {
            // Aquí podrías validar complejidad si fuera necesario
            const error = validateVestoField("password", value);
            setErrors((prev) => ({ ...prev, [name]: error }));
        } else if (name !== "avatar" && name !== "newPassword") {
            const error = validateVestoField(name, value);
            setErrors((prev) => ({ ...prev, [name]: error }));
        }
    };

    // Maneja la subida de imagen
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData((prev) => ({ ...prev, avatar: file }));
            setPreview(URL.createObjectURL(file)); // Crea URL temporal
            setErrors((prev) => ({ ...prev, avatar: "" }));
        }
    };

    // Envío del formulario
    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        // Validaciones
        const newErrors = {
            nombreApellidos: validateVestoField("nombreApellidos", formData.nombreApellidos),
            email: validateVestoField("email", formData.email),
            usuario: validateVestoField("usuario", formData.usuario),
            // Asumimos que la contraseña actual es obligatoria para guardar cambios sensibles
            password: formData.password ? validateVestoField("password", formData.password) : "La contraseña es requerida para guardar",
            newPassword: "", // Opcional
            avatar: ""
        };

        setErrors(newErrors as ErrorsProps);

        const hasErrors = Object.values(newErrors).some((err) => err !== "");

        if (!hasErrors) {
            console.log("Datos actualizados:", formData);
            alert("Cambios guardados correctamente ✅");
            // Aquí llamaríamos al repositorio: userRepository.updateUser(...)
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
                    />

                    <Input
                        label="Nombre de usuario"
                        name="usuario"
                        type="text"
                        value={formData.usuario}
                        placeholder="Text input"
                        autoComplete="username"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.usuario}
                    />

                    <Input
                        label="Contraseña *"
                        name="password"
                        type="password"
                        value={formData.password}
                        placeholder="Text input"
                        autoComplete="current-password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.password}
                    />

                    <Input
                        label="Nueva contraseña *"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        placeholder="Text input"
                        autoComplete="new-password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.newPassword}
                    />

                    <div className="flex gap-4 pt-4 mt-8">
                        <Button type="submit" className="btn btn-primary bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-md">
                            Guardar cambios
                        </Button>
                        <Button
                            type="button"
                            className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition-colors"
                            onClick={() => console.log("Cancelar acción")}
                        >
                            Cancelar
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