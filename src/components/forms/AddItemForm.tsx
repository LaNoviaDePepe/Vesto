import { useState, type ChangeEvent, type FocusEvent } from "react";
import { validateVestoField } from "../../utils/regex";
import Button from "../common/Button";
import Input from "../common/Input";
import Select from "../common/Select";
import { SupabaseItemRepository } from "../../database/supabase/SupabaseItemRepository";
import { useAuthStore } from "../../stores/authStore";
import * as CONSTANTES from '../../utils/constants';
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

/**
 * Interfaz que define la estructura de los datos del formulario de prendas.
 * @property {string} nombre - Nombre descriptivo de la prenda.
 * @property {string} tipoPrenda - Categoría o tipo de la prenda.
 * @property {string} color - Color principal.
 * @property {string} temporada - Temporada ideal para la prenda.
 * @property {File | null} imagen - Archivo de imagen de la prenda subido por el usuario.
 */
interface AddItemFormProps { nombre: string; tipoPrenda: string; color: string; temporada: string; imagen: File | null; }

/** Interfaz que define los posibles errores de validación del formulario. */
interface ErrorsProps { nombre: string; tipoPrenda: string; color: string; temporada: string; imagen: string; }

/**
 * Componente `AddItemForm`.
 * * Formulario para subir o modificar una prenda en el armario del usuario.
 * Gestiona atributos, previsualización de imagen y subida a base de datos.
 * Totalmente adaptado para compatibilidad con el modo oscuro.
 * @returns {JSX.Element} El componente del formulario de prendas renderizado.
 */
export default function AddItemForm() {
    const { t } = useTranslation();
    const itemRepository = new SupabaseItemRepository();
    const { sessionUser } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<AddItemFormProps>({ nombre: "", tipoPrenda: "", color: "", temporada: "", imagen: null });
    const [errors, setErrors] = useState<ErrorsProps>({ nombre: "", tipoPrenda: "", color: "", temporada: "", imagen: "" });
    const [preview, setPreview] = useState<string | null>(null);

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
            setPreview(URL.createObjectURL(file)); 
            setErrors((prev) => ({ ...prev, imagen: "" }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = {
            nombre: validateVestoField("nombre", formData.nombre) as string,
            tipoPrenda: formData.tipoPrenda ? "" : t('filter.choose_category'),
            color: formData.color ? "" : t('filter.choose_color'),
            temporada: formData.temporada ? "" : t('filter.choose_season'),
            imagen: formData.imagen ? "" : t('clothing.must_upload_img')
        };
        setErrors(newErrors);

        if (!Object.values(newErrors).some(err => err !== "")) {
            if (!sessionUser) { toast.error(t('clothing.must_login')); return; }
            setLoading(true);
            try {
                const result = await itemRepository.createPrenda({
                    nombre: formData.nombre, tipoPrenda: formData.tipoPrenda, color: formData.color,
                    temporada: formData.temporada, imagen: formData.imagen!, userId: sessionUser.user.id
                });
                if (result.error) {
                    const errorMsg = (result.error as any).message || "Error desconocido";
                    toast.error(`${t('clothing.error_upload_clothing')} ${errorMsg}`);
                } else {
                    toast.success(t('clothing.ok_upload_clothing'));
                    setFormData({ nombre: "", tipoPrenda: "", color: "", temporada: "", imagen: null });
                    setPreview(null);
                }
            } catch (err) {
                toast.error(t('clothing.error_unexpected_upload'));
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="mb-10 pt-10 pb-10 px-7.5 lg:mx-auto mx-10 max-w-4xl bg-white dark:bg-gray-900 border-2 border-auxiliary-700 dark:border-gray-700 rounded-2xl shadow-xl dark:shadow-none transition-colors duration-300">
            <h3 className="text-center mb-8 text-gray-900 dark:text-white transition-colors duration-300">{t('clothing.add_edit_title')}</h3>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="w-full aspect-square max-w-90 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 flex items-center justify-center relative transition-colors duration-300">
                        {preview ? (
                            <img src={preview} alt={t('clothing.preview')} className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-center p-6">
                                <div className="w-20 h-20 mx-auto mb-4 bg-linear-to-br from-auxiliary-300 to-auxiliary-700 dark:from-gray-600 dark:to-gray-800 rounded-lg flex items-center justify-center text-white opacity-50 transition-colors duration-300">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className="text-gray-400 font-medium">{t('clothing.no_image')}</p>
                            </div>
                        )}
                    </div>

                    <div className="w-full max-w-75">
                        <input
                            type="file" name="imagen" accept="image/*" onChange={handleFileChange}
                            className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 dark:file:bg-gray-700 file:text-gray-700 dark:file:text-gray-200 hover:file:bg-gray-200 dark:hover:file:bg-gray-600 cursor-pointer border dark:border-gray-700 rounded-md transition-colors duration-300"
                        />
                        {errors.imagen && <p className="mt-2 text-sm text-danger-600 dark:text-red-400 font-medium">{errors.imagen}</p>}
                    </div>
                </div>

                <div className="flex flex-col space-y-6">
                    <Input label={t('clothing.name')} name="nombre" type="text" value={formData.nombre} autoComplete="off" onChange={handleChange} onBlur={handleBlur} error={errors.nombre} />
                    
                    <div>
                        <label className="block mb-2 text-sm font-normal text-gray-900 dark:text-gray-200 transition-colors duration-300">{t('clothing.type')}</label>
                        <Select name="tipoPrenda" value={formData.tipoPrenda} options={CONSTANTES.CATEGORIA_PRENDA} onChange={handleChange} onBlur={handleBlur} error={errors.tipoPrenda} placeholder={t('clothing.select_type')} />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-normal text-gray-700 dark:text-gray-300 transition-colors duration-300">{t('clothing.color')}</label>
                        <Select name="color" value={formData.color} options={CONSTANTES.COLOR_PRENDA} onChange={handleChange} onBlur={handleBlur} error={errors.color} placeholder={t('clothing.select_color')} />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-normal text-gray-700 dark:text-gray-300 transition-colors duration-300">{t('clothing.season')}</label>
                        <Select name="temporada" value={formData.temporada} options={CONSTANTES.TEMPORADA_PRENDA} onChange={handleChange} onBlur={handleBlur} error={errors.temporada} placeholder={t('clothing.select_season')} />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="submit" disabled={loading} className="btn btn-primary">{loading ? t('actions.saving') : t('actions.save')}</Button>
                        <Button type="button" className="btn btn-secondary">{t("actions.cancel")}</Button>
                    </div>
                </div>
            </form>
        </div>
    );
}