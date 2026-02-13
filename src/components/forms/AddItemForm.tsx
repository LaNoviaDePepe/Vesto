import { useState, type ChangeEvent, type FocusEvent } from "react";
import { validateVestoField } from "../../utils/regex";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";
import { SupabaseItemRepository } from "../../database/supabase/SupabaseItemRepository";
import { useAuthStore } from "../../stores/authStore ";

interface AddItemFormProps {
    nombre: string;
    tipoPrenda: string;
    color: string;
    temporada: string;
    imagen: File | null;
}

interface ErrorsProps {
    nombre: string;
    tipoPrenda: string;
    color: string;
    temporada: string;
    imagen: string;
}

const PRENDA_OPTIONS = ["cabeza", "partearriba", "parteabajo", "complemento", "calzado"];
const COLOR_OPTIONS = ["negro", "blanco", "gris", "rojo", "azul", "amarillo", "verde", "naranja", "morado", "rosa", "marron", "celeste", "turquesa", "violeta", "beige", "dorado", "plateado", "cian", "magenta"];
const TEMPORADA_OPTIONS = ["otoño", "invierno", "primavera", "verano"];

export default function AddItemForm() {

    // Instanciar el repo y obtener el usuario
    const itemRepository = new SupabaseItemRepository();
    const { sessionUser } = useAuthStore();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<AddItemFormProps>({
        nombre: "",
        tipoPrenda: "",
        color: "",
        temporada: "",
        imagen: null
    });

    const [errors, setErrors] = useState<ErrorsProps>({
        nombre: "",
        tipoPrenda: "",
        color: "",
        temporada: "",
        imagen: ""
    });

    // Lógica de previsualización de imagen
    const [preview, setPreview] = useState<string | null>(null);

    // Maneja inputs y selects
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (e.target.type !== "file") {
            const error = validateVestoField(name, value);
            setErrors((prev) => ({ ...prev, [name]: error as string }));
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData((prev) => ({ ...prev, imagen: file }));
            setPreview(URL.createObjectURL(file)); // Crea URL temporal para la imagen
            setErrors((prev) => ({ ...prev, imagen: "" }));
        }
    };

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        // Necesitamos volver a declarar las validaciones aquí para calcular la variable
        const newErrors = {
            nombre: validateVestoField("nombre", formData.nombre) as string,
            tipoPrenda: formData.tipoPrenda ? "" : "Selecciona una prenda",
            color: formData.color ? "" : "Selecciona un color",
            temporada: formData.temporada ? "" : "Selecciona una temporada",
            imagen: formData.imagen ? "" : "Debes subir una imagen"
        };

        setErrors(newErrors);

        // Aquí definimos la variable que te faltaba
        const hasErrors = Object.values(newErrors).some(err => err !== "");

        if (!hasErrors) {
            // Verificamos sesión
            if (!sessionUser) {
                alert("Debes iniciar sesión para subir prendas");
                return;
            }

            setLoading(true);

            // Llamamos al repositorio
            const result = await itemRepository.createPrenda({
                nombre: formData.nombre,
                tipoPrenda: formData.tipoPrenda,
                color: formData.color,
                temporada: formData.temporada,
                imagen: formData.imagen!,
                userId: sessionUser.user.id
            });

            setLoading(false);

            if (result.error) {
                // Usamos 'any' temporalmente o verificamos si message existe para calmar a TypeScript
                const errorMsg = (result.error as any).message || "Error desconocido";
                alert("Error al subir la prenda: " + errorMsg);
            } else {
                alert("Prenda creada correctamente ✅");
                // Resetear formulario
                setFormData({ nombre: "", tipoPrenda: "", color: "", temporada: "", imagen: null });
                setPreview(null);
            }
        }
    };

    return (
        <div className="py-5 px-7.5 max-w-4xl mx-auto bg-white border-2 border-auxiliary-700 rounded-2xl shadow-xl">
            <h3 className="text-center mb-8">Subir prenda/Modificar prenda</h3>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* COLUMNA IZQUIERDA: Formulario */}
                <div className="flex flex-col space-y-6">
                    <Input
                        label="Nombre de la prenda"
                        name="nombre"
                        type="text"
                        value={formData.nombre}
                        autoComplete="off"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.nombre}
                    />

                    <div>
                        <label className="block mb-2 text-sm font-normal text-gray-900">Tipo de Prenda</label>
                        <Select
                            name="tipoPrenda"
                            value={formData.tipoPrenda}
                            options={PRENDA_OPTIONS}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.tipoPrenda}
                            placeholder="Selecciona tipo..."
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-normal text-gray-700">Color</label>
                        <Select
                            name="color"
                            value={formData.color}
                            options={COLOR_OPTIONS}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.color}
                            placeholder="Selecciona color..."
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-normal text-gray-700">Temporada</label>
                        <Select
                            name="temporada"
                            value={formData.temporada}
                            options={TEMPORADA_OPTIONS}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.temporada}
                            placeholder="Selecciona temporada..."
                        />
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-4 pt-4">
                        <Button type="submit" disabled={loading} className="btn btn-primary">
                            {loading ? "Guardando..." : "Guardar"}
                        </Button>
                        <Button type="button" className="btn btn-secondary">
                            Cancelar
                        </Button>
                    </div>
                </div>

                {/* COLUMNA DERECHA: Imagen */}
                <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="w-full aspect-square max-w-90 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center relative">
                        {preview ? (
                            <img src={preview} alt="Vista previa" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center p-6">
                                {/* Icono de "No image available" con gradiente naranja */}
                                <div className="w-20 h-20 mx-auto mb-4 bg-linear-to-br from-auxiliary-300 to-auxiliary-700 rounded-lg flex items-center justify-center text-white opacity-50">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className="text-gray-400 font-medium">No Image Available</p>
                            </div>
                        )}
                    </div>

                    {/* Input File */}
                    <div className="w-full max-w-75">
                        <input
                            type="file"
                            name="imagen"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer border rounded-md"
                        />
                        {errors.imagen && <p className="mt-2 text-sm text-danger-600 font-medium">{errors.imagen}</p>}
                    </div>
                </div>
            </form>
        </div>
    );
}