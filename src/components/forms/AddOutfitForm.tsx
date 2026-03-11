import { useState, type ChangeEvent } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import { OutfitSlot } from "../clothing/OutfitSlot";
import { SupabaseOutfitRepository } from "../../database/supabase/SupabaseOutfitRepository";
import { useAuthStore } from "../../stores/authStore";
import toast from "react-hot-toast";
import type { PrendaProps } from "../clothing/Prenda";

interface AddOutfitFormProps {
  outfit: Record<string, PrendaProps | null>;
  onResetOutfit: () => void;
}

interface ErrorsProps {
  nombre: string;
  outfit: string;
  imagen: string;
}

const outfitRepo = new SupabaseOutfitRepository();

export default function AddOutfitForm({ outfit, onResetOutfit }: AddOutfitFormProps) {
  const { sessionUser } = useAuthStore();

  // Estados locales del formulario
  const [nombreConjunto, setNombreConjunto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagenConjunto, setImagen] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const [errors, setErrors] = useState<ErrorsProps>({
    nombre: "",
    outfit: "",
    imagen: ""
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagen(file);
      setPreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, imagen: "" }));
    }
  };

  const handleSaveOutfit = async (e: React.FormEvent) => {
    e.preventDefault();

    const prendasSeleccionadas = Object.values(outfit).filter((p): p is PrendaProps => p !== null);

    // Validaciones
    const newErrors = {
      nombre: !nombreConjunto.trim() ? "Por favor, introduce un nombre para el conjunto." : "",
      outfit: prendasSeleccionadas.length === 0 ? "Debes seleccionar al menos una prenda." : "",
      imagen: ""
    };

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some(err => err !== "");

    if (!hasErrors && sessionUser) {
      setLoading(true);

      const { error } = await outfitRepo.createConjunto({
        nombre: nombreConjunto,
        descripcion: descripcion,
        id_usuario: sessionUser.user.id,
        favorito: false,
        url_imagen: imagenConjunto ?? undefined,
        prendasIds: prendasSeleccionadas
          .filter(p => p.id !== undefined)
          .map(p => Number(p.id)),
      });

      setLoading(false);

      if (error) {
        if (typeof error === 'object' && 'code' in error && error.code === '23505') {
          toast.error(`Ya tienes un conjunto llamado '${nombreConjunto}'.`);
        } else {
          toast.error("Hubo un error al guardar el conjunto.");
        }
      } else {
        toast.success(`¡Conjunto '${nombreConjunto}' guardado con éxito!`);
        // Resetear formulario y selección del padre
        setNombreConjunto("");
        setDescripcion("");
        setPreview(null);
        setImagen(null);
        onResetOutfit();
      }
    }
  };

  return (
    <form onSubmit={handleSaveOutfit} className="w-full lg:w-125 xl:w-150 bg-auxiliary-50 flex flex-col p-8 h-svh overflow-y-auto">
      <div className="flex flex-col gap-4 mb-10">
        <div className="flex gap-3 ">
          <Input
            placeholder="Nombre del conjunto"
            value={nombreConjunto}
            disabled={loading}
            onChange={(e) => {
              setNombreConjunto(e.target.value);
              setErrors(prev => ({ ...prev, nombre: "" }));
            }}
            error={errors.nombre}
          />
          <Button variant="primary" type="submit" disabled={loading} className="min-w-30 self-center">
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </div>

        <textarea
          placeholder="Descripción del conjunto..."
          value={descripcion}
          disabled={loading}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={2}
          className="w-full rounded-md text-sm border border-gray-300 px-4 py-3 outline-none bg-white transition-all font-body focus:border-auxiliary-700 focus:ring-1 focus:ring-auxiliary-700 placeholder:text-gray-300 shadow-sm resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
        />
        {errors.outfit && <p className="text-red-500 text-sm font-bold">{errors.outfit}</p>}
      </div>

      {/* Grid de Slots */}
      <div className="flex flex-col gap-8 items-center">
        <div className="flex justify-center gap-6 w-full">
          <OutfitSlot label="Cabeza" item={outfit.cabeza} />
          <OutfitSlot label="Parte Arriba" item={outfit.parte_arriba} />
          <OutfitSlot label="Complemento" item={outfit.complemento} />
        </div>
        <div className="flex justify-center gap-6 w-full">
          <OutfitSlot label="Parte Abajo" item={outfit.parte_abajo} />
          <OutfitSlot label="Calzado" item={outfit.calzado} />
        </div>
      </div>

      {/* Foto del Outfit */}
      <div className="flex flex-col items-center justify-center space-y-6 mt-10 pb-20 mb-10">
        <div className="w-full max-w-75">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer border rounded-md"
          />
        </div>
        <div className="w-full aspect-square max-w-80 rounded-2xl overflow-auto border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center relative">
          {preview ? (
            <img src={preview} alt="Vista previa" className="w-50 h-50 object-cover" />
          ) : (
            <div className="text-center p-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-linear-to-br from-auxiliary-300 to-auxiliary-700 rounded-lg flex items-center justify-center text-white opacity-50">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-400 font-medium">Sube foto de tu outfit</p>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}