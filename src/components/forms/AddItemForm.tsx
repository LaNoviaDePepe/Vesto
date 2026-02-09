import { useState, type ChangeEvent, type FocusEvent } from "react";
import { validateVestoField } from "../../utils/regex";
import Button from "../common/Button";
import InputFieldClase from "./InputFieldClase";

interface AddItemFormProps {
    nombre: string;
    tipoPrenda: "Cabeza" | "ParteArriba" | "ParteAbajo" | "Complemento" | "Calzado";
    color: "NEGRO" | "BLANCO" | "GRIS" | "ROJO" | "AZUL" | "AMARILLO" | "VERDE" | "NARANJA" | "MORADO" | "ROSA" | "MARRON" | "CELESTE" | "TURQUESA" | "VIOLETA" | "BEIGE" | "DORADO" | "PLATEADO" | "CIAN" | "MAGENTA";
    temporada: "Otoño" | "Invierno" | "Primavera" | "Verano";
    imagen: File | null;
}

interface ErrorsProps {
    nombre: string;
    tipoPrenda: "Cabeza" | "ParteArriba" | "ParteAbajo" | "Complemento" | "Calzado";
    color: "NEGRO" | "BLANCO" | "GRIS" | "ROJO" | "AZUL" | "AMARILLO" | "VERDE" | "NARANJA" | "MORADO" | "ROSA" | "MARRON" | "CELESTE" | "TURQUESA" | "VIOLETA" | "BEIGE" | "DORADO" | "PLATEADO" | "CIAN" | "MAGENTA";
    temporada: "Otoño" | "Invierno" | "Primavera" | "Verano";
    imagen: string;
}

export default function AddItemForm() {
    const [formData, setFormData] = useState<AddItemFormProps>({
        nombre: "",
        tipoPrenda: "Cabeza",
        color: "NEGRO",
        temporada: "Invierno",
        imagen: null
    });

    const [errors, setErrors] = useState<ErrorsProps>({
        nombre: "",
        tipoPrenda: "Cabeza",
        color: "NEGRO",
        temporada: "Invierno",
        imagen: ""
    });

    // Maneja inputs de texto y selectores
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Usamos 'as any' porque tu interfaz ErrorsProps es estricta y no admite strings vacíos en los selects
        setErrors((prev) => ({ ...prev, [name]: "" as any }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData((prev) => ({ ...prev, imagen: e.target.files![0] }));
            setErrors((prev) => ({ ...prev, imagen: "" }));
        }
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (e.target.type !== "file") {
            const error = validateVestoField(name, value);
            // TypeScript necesita 'as any' aquí para aceptar el mensaje de error en tus interfaces estrictas
            setErrors((prev) => ({ ...prev, [name]: error as any }));
        }
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        // Validamos. Usamos casting 'as any' para evitar el bloqueo de tipos de tu interfaz
        const newErrors = {
            nombre: validateVestoField("nombre", formData.nombre),
            tipoPrenda: (formData.tipoPrenda ? "" : "Error") as any,
            color: (formData.color ? "" : "Error") as any,
            temporada: (formData.temporada ? "" : "Error") as any,
            imagen: formData.imagen ? "" : "Debes subir una imagen"
        };

        setErrors(newErrors);

        // Solo comprobamos errores reales en nombre e imagen, ya que los select siempre tienen valor por defecto
        const hasErrors = newErrors.nombre || newErrors.imagen;

        if (!hasErrors) {
            console.log("Artículo válido:", formData);
            alert("Artículo creado correctamente");
        }
    };

    // Estilo interno para los inputs select
    const inputClassName = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5";

    return (
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4">

            <InputFieldClase
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
                <label className="block mb-2 text-sm font-medium text-gray-900">Tipo de Prenda</label>
                <select
                    name="tipoPrenda"
                    value={formData.tipoPrenda}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClassName}
                >
                    {["Cabeza", "ParteArriba", "ParteAbajo", "Complemento", "Calzado"].map((op) => (
                        <option key={op} value={op}>{op}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Color</label>
                <select
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClassName}
                >
                    {["NEGRO", "BLANCO", "GRIS", "ROJO", "AZUL", "AMARILLO", "VERDE", "NARANJA", "MORADO", "ROSA", "MARRON", "CELESTE", "TURQUESA", "VIOLETA", "BEIGE", "DORADO", "PLATEADO", "CIAN", "MAGENTA"].map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Temporada</label>
                <select
                    name="temporada"
                    value={formData.temporada}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClassName}
                >
                    {["Otoño", "Invierno", "Primavera", "Verano"].map((t) => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Imagen</label>
                <input
                    type="file"
                    name="imagen"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                />
                {/* Mostramos error de imagen si no está vacía y no es null */}
                {errors.imagen && <p className="mt-2 text-sm text-red-600">{errors.imagen}</p>}
            </div>

            <Button type="submit">Guardar Prenda</Button>
        </form>
    );
}