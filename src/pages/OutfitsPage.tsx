import { useEffect, useState } from "react";
import Conjunto from "../components/clothing/Conjunto";
import { SupabaseOutfitRepository } from "../database/supabase/SupabaseOutfitRepository";
import { useAuthStore } from "../stores/authStore";
import toast from "react-hot-toast";
import Modal from "../components/common/Modal";
import { useTranslation } from "react-i18next";

/**
 * Componente `OutfitsPage`.
 * * Muestra la lista de conjuntos (outfits) creados por el usuario.
 * Permite gestionar favoritos y eliminar conjuntos completos.
 * Adaptado con soporte de texto oscuro (`dark:text-white`).
 * @returns {JSX.Element} Vista de los conjuntos guardados.
 */
export default function OutfitsPage() {
  const { t } = useTranslation();
  const [conjuntos, setConjuntos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [outfitToDelete, setOutfitToDelete] = useState<{ id: number, url: string } | null>(null);

  const outfitRepository = new SupabaseOutfitRepository();
  const { sessionUser } = useAuthStore();

  useEffect(() => {
    async function load() {
      if (!sessionUser) return;
      const { data, error } = await outfitRepository.getConjuntos(sessionUser.user.id);
      if (error) { console.error(error); } else { setConjuntos(data); }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="dark:text-white">{t('outfit.loading_outfits')}</div>;

  const handleToggleFavorito = async (id: number, estadoActual: boolean) => {
    const nuevoEstado = !estadoActual;
    setConjuntos(prevConjuntos => prevConjuntos.map(c => c.id === id ? { ...c, favorito: nuevoEstado } : c));
    const { error } = await outfitRepository.isFavorito(id, nuevoEstado);
    if (error) {
      console.error("Error guardando favorito:", error);
      setConjuntos(prevConjuntos => prevConjuntos.map(c => c.id === id ? { ...c, favorito: estadoActual } : c));
    }
  };

  const openDeleteModal = (id: number, url: string) => {
    setOutfitToDelete({ id, url });
    setIsModalOpen(true);
  };

  const handleDeleteConjunto = async () => {
    if (!outfitToDelete) return;
    const { id, url } = outfitToDelete;
    setIsModalOpen(false);
    const conjuntosAnteriores = [...conjuntos];
    setConjuntos(prevConjuntos => prevConjuntos.filter(c => c.id !== id));

    const { error } = await outfitRepository.deleteConjunto(id, url);
    if (error) {
      console.error("Error borrando conjunto:", error);
      toast.error(t('outfit.delete_error'));
      setConjuntos(conjuntosAnteriores);
    } else {
      toast.success(t('outfit.delete_success'));
    }
    setOutfitToDelete(null);
  };

  return (
    <div className="flex flex-col gap-10 px-10 text-gray-900 dark:text-white transition-colors duration-300">
      {conjuntos.length > 0 ? (
        conjuntos.map(conjunto => (
          <Conjunto key={conjunto.id} {...conjunto} toggleFavorito={handleToggleFavorito} onDelete={openDeleteModal} />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-500 transition-colors duration-300">
          <p className="text-lg">{t('outfit.no_outfits')}</p>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleDeleteConjunto} title={t('modal.delete_outfit_title')} message={t('modal.delete_outfit_msg')} />
    </div>
  );
}