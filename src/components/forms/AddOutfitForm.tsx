import { useState, type ChangeEvent } from "react";
import Button from "../common/Button";
import Input from "../common/Input";
import { OutfitSlot } from "../clothing/OutfitSlot";
import { SupabaseOutfitRepository } from "../../database/supabase/SupabaseOutfitRepository";
import { useAuthStore } from "../../stores/authStore";
import toast from "react-hot-toast";
import type { PrendaProps } from "../clothing/Prenda";
import { useTranslation } from "react-i18next";

/**
 * Propiedades para el componente AddOutfitForm.
 * @interface AddOutfitFormProps
 */
interface AddOutfitFormProps { 
  outfit: Record<string, PrendaProps | null>; 
  onResetOutfit: () => void; 
}

/** Interfaz de errores locales. */
interface ErrorsProps { nombre: string; outfit: string; imagen: string; }

const outfitRepo = new SupabaseOutfitRepository();

/**
 * Componente `AddOutfitForm`.
 * * Gestiona la creación de conjuntos (outfits) agrupando varias prendas.
 * Permite añadir descripción, imagen y guarda el conjunto en la base de datos.
 * Implementa colores del modo oscuro con soporte a transiciones.
 * @param {AddOutfitFormProps} props - El estado actual del outfit y la función para resetearlo.
 * @returns {JSX.Element} Formulario de guardado del conjunto.
 */
export default function AddOutfitForm({ outfit, onResetOutfit }: AddOutfitFormProps) {
  const { sessionUser } = useAuthStore();
  const { t } = useTranslation();
  const [nombreConjunto, setNombreConjunto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagenConjunto, setImagen] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const [errors, setErrors] = useState<ErrorsProps>({ nombre: "", outfit: "", imagen: "" });

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

    const newErrors = {
      nombre: !nombreConjunto.trim() ? t('outfit.name_required') : "",
      outfit: prendasSeleccionadas.length === 0 ? t('outfit.min_one_item') : "",
      imagen: ""
    };
    setErrors(newErrors);

    if (!Object.values(newErrors).some(err => err !== "") && sessionUser) {
      setLoading(true);
      const { error } = await outfitRepo.createConjunto({
        nombre: nombreConjunto, descripcion: descripcion, id_usuario: sessionUser.user.id,
        favorito: false, url_imagen: imagenConjunto ?? undefined,
        prendasIds: prendasSeleccionadas.filter(p => p.id !== undefined).map(p => Number(p.id)),
      });
      setLoading(false);

      if (error) {
        if (typeof error === 'object' && 'code' in error && error.code === '23505') {
          toast.error(t('outfit.duplicate_name', { name: nombreConjunto }));
        } else {
          toast.error(t('outfit.save_error'));
        }
      } else {
        toast.success(t('outfit.save_success', { name: nombreConjunto }));
        setNombreConjunto(""); setDescripcion(""); setPreview(null); setImagen(null);
        onResetOutfit();
      }
    }
  };

  return (
    <form onSubmit={handleSaveOutfit} className="w-full bg-auxiliary-50 dark:bg-gray-900 flex flex-col p-5 md:p-6 h-auto max-h-[calc(100vh-120px)] overflow-y-auto rounded-2xl transition-colors duration-300">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex gap-3 ">
          <Input placeholder={t('outfit.name_placeholder')} value={nombreConjunto} disabled={loading} onChange={(e) => { setNombreConjunto(e.target.value); setErrors(prev => ({ ...prev, nombre: "" })); }} error={errors.nombre} />
          <Button variant="primary" type="submit" disabled={loading} className="min-w-30 self-center">
            {loading ? t('actions.saving') : t('actions.save')}
          </Button>
        </div>

        <textarea
          placeholder={t('outfit.desc_placeholder')} value={descripcion} disabled={loading} onChange={(e) => setDescripcion(e.target.value)} rows={2}
          className="w-full rounded-md text-sm border border-gray-300 dark:border-gray-600 px-4 py-3 outline-none bg-white dark:bg-gray-800 dark:text-white transition-all font-body focus:border-auxiliary-700 dark:focus:border-primary-500 focus:ring-1 focus:ring-auxiliary-700 dark:focus:ring-primary-500 placeholder:text-gray-300 dark:placeholder:text-gray-500 shadow-sm resize-none disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:cursor-not-allowed"
        />
        {errors.outfit && <p className="text-red-500 dark:text-red-400 text-sm font-bold">{errors.outfit}</p>}
      </div>

      {/* Grid de Slots */}
      <div className="flex flex-row flex-wrap justify-center gap-3 mb-4">
        <OutfitSlot label={t('outfit.head')} item={outfit.cabeza} />
        <OutfitSlot label={t('outfit.top')} item={outfit.parte_arriba} />
        <OutfitSlot label={t('outfit.accessory')} item={outfit.complemento} />
        <OutfitSlot label={t('outfit.bottom')} item={outfit.parte_abajo} />
        <OutfitSlot label={t('outfit.shoes')} item={outfit.calzado} />
      </div>

      <div className="flex flex-col items-center justify-center space-y-6 mt-10 mb-10">
        <div className="w-full max-w-75">
          <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 dark:file:bg-gray-700 file:text-gray-700 dark:file:text-gray-200 hover:file:bg-gray-200 dark:hover:file:bg-gray-600 cursor-pointer border dark:border-gray-600 rounded-md transition-colors duration-300" />
        </div>
        <div className="w-full aspect-square max-w-80 rounded-2xl overflow-auto border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 flex items-center justify-center relative transition-colors duration-300">
          {preview ? (
            <img src={preview} alt={t('clothing.preview')} className="w-50 h-50 object-cover" />
          ) : (
            <div className="text-center p-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-linear-to-br from-auxiliary-300 to-auxiliary-700 dark:from-gray-600 dark:to-gray-800 rounded-lg flex items-center justify-center text-white opacity-50 transition-colors duration-300">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <p className="text-gray-400 font-medium">{t('outfit.upload_photo')}</p>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}