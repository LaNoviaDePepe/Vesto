import { useEffect, useState } from "react";
import Filter, { type FilterState } from "../components/filter/Filter";
import PrendasLayout from "../layouts/PrendasLayout";
import { SupabaseItemRepository } from "../database/supabase/SupabaseItemRepository";
import { useAuthStore } from "../stores/authStore";
import toast from "react-hot-toast";
import type { PrendaProps } from "../components/clothing/Prenda";
import Modal from "../components/common/Modal/Modal";
import { useTranslation } from "react-i18next";

const itemRepository = new SupabaseItemRepository();

/**
 * Componente `ClosetPage`.
 * * Representa el "Armario Virtual" del usuario. 
 * Muestra un grid con todas las prendas subidas, permitiendo filtrarlas, 
 * marcarlas como favoritas o eliminarlas. 
 * @returns {JSX.Element} Vista del armario de prendas.
 */
export default function ClosetPage() {
  const { t } = useTranslation();
  const [prendas, setPrendas] = useState<PrendaProps[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: number, url: string } | null>(null);

  const { sessionUser } = useAuthStore();
  const [filters, setFilters] = useState<FilterState>({ categoria: "", temporada: "", color: "", favorito: false });

  const handleFilterChange = (key: string, value: string | boolean) => setFilters((prev) => ({ ...prev, [key]: value }));
  const handleResetFilters = () => setFilters({ categoria: "", temporada: "", color: "", favorito: false });

  useEffect(() => {
    if (!sessionUser) return;
    const loadPrendas = async () => {
      const { data, error } = await itemRepository.getPrendas(
        sessionUser.user.id
      );

      if (error) {
        toast.error(t('error.random_error'));
        return;
      }

      setPrendas(data ?? []);
    };
    loadPrendas();
  }, [sessionUser]);

  const prendasFiltradas = prendas.filter((prenda: PrendaProps) => {
    if (filters.categoria && prenda.categoria !== filters.categoria) return false;
    if (filters.temporada && prenda.temporada !== filters.temporada) return false;
    if (filters.color && prenda.color !== filters.color) return false;
    if (filters.favorito && !prenda.favorito) return false;
    return true;
  });

  const handleToggleFavorito = async (id: number, estadoActual: boolean) => {
    const nuevoEstado = !estadoActual;
    setPrendas(prevPrendas => prevPrendas.map(p => p.id === id ? { ...p, favorito: nuevoEstado } : p));
    const { error } = await itemRepository.toggleFavorito(id, nuevoEstado);
    if (error) {
      toast.error(t('error.saving'));
      setPrendas(prevPrendas =>
        prevPrendas.map(p => p.id === id ? { ...p, favorito: estadoActual } : p)
      );
    }
  };

  const openDeleteModal = (id: number, url: string) => {
    setItemToDelete({ id, url });
    setIsModalOpen(true);
  };

  const handleDeletePrenda = async () => {
    if (!itemToDelete) return;
    const { id, url } = itemToDelete;
    setIsModalOpen(false);
    const prendasAnteriores = [...prendas];
    setPrendas(prevPrendas => prevPrendas.filter(p => p.id !== id));

    const { error } = await itemRepository.deletePrenda(id, url);
    if (error) {
      if (typeof error === 'object' && 'code' in error && error.code === '23503') {
        toast.error(t('clothing.delete_error_in_outfit'));
      } else {
        toast.error(t('clothing.delete_error'));
      }
      setPrendas(prendasAnteriores);
    } else {
      toast.success(t('clothing.delete_success'));
    }
    setItemToDelete(null);
  };

  return (
    <>
      <Filter width={100} filters={filters} onFilterChange={handleFilterChange} />

      {prendasFiltradas.length > 0 ? (
        <PrendasLayout prendas={prendasFiltradas} onToggleFavorito={handleToggleFavorito} onDelete={openDeleteModal} />
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-500 transition-colors duration-300">
          <p className="text-lg">{t('filter.no_results')}</p>
          <button onClick={handleResetFilters} className="text-primary-600 dark:text-primary-400 underline mt-4 hover:text-primary-800 dark:hover:text-primary-300 transition-colors cursor-pointer">
            {t('filter.clear_filters')}
          </button>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleDeletePrenda} title={t('modal.delete_item_title')} message={t('modal.delete_item_msg')} />
    </>
  );
}