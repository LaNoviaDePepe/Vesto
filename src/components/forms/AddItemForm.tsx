import { useState, type ChangeEvent, type FocusEvent } from "react"; // <--- 1. CORREGIDO: añadido 'type'
import { validateVestoField } from "../../utils/regex";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";

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

const PRENDA_OPTIONS = ["Cabeza", "ParteArriba", "ParteAbajo", "Complemento", "Calzado"];
const COLOR_OPTIONS = ["NEGRO", "BLANCO", "GRIS", "ROJO", "AZUL", "AMARILLO", "VERDE", "NARANJA", "MORADO", "ROSA", "MARRON", "CELESTE", "TURQUESA", "VIOLETA", "BEIGE", "DORADO", "PLATEADO", "CIAN", "MAGENTA"];
const TEMPORADA_OPTIONS = ["Otoño", "Invierno", "Primavera", "Verano"];

export default function AddItemForm() {
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
            setFormData((prev) => ({ ...prev, imagen: e.target.files![0] }));
            setErrors((prev) => ({ ...prev, imagen: "" }));
        }
    };

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();

        // Validación simple
        const newErrors = {
            nombre: validateVestoField("nombre", formData.nombre) as string,
            tipoPrenda: formData.tipoPrenda ? "" : "Selecciona una prenda",
            color: formData.color ? "" : "Selecciona un color",
            temporada: formData.temporada ? "" : "Selecciona una temporada",
            imagen: formData.imagen ? "" : "Debes subir una imagen"
        };

        setErrors(newErrors);

        // Si algún valor en newErrors no es string vacío, hay error
        const hasErrors = Object.values(newErrors).some(err => err !== "");

        if (!hasErrors) {
            console.log("Artículo válido:", formData);
            alert("Artículo creado correctamente");
        }
    };

    return (
        
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4">

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
                <label className="block mb-2 text-sm font-medium text-gray-900">Tipo de Prenda</label>
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
                <label className="block mb-2 text-sm font-medium text-gray-900">Color</label>
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
                <label className="block mb-2 text-sm font-medium text-gray-900">Temporada</label>
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

            <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">Imagen</label>
                <input
                    type="file"
                    name="imagen"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                />
                {errors.imagen && <p className="mt-2 text-sm text-red-600">{errors.imagen}</p>}
            </div>

            <Button type="submit" className="btn btn-primary">Guardar</Button>
            <Button type="button" className="btn btn-secondary">Cancelar</Button>
        </form>
    );
}