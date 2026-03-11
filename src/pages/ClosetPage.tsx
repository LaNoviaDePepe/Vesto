import { useEffect, useState } from "react";
import Filter, { type FilterState } from "../components/filter/Filter";
import PrendasLayout from "../layouts/PrendasLayout";
import { SupabaseItemRepository } from "../database/supabase/SupabaseItemRepository";
import { useAuthStore } from "../stores/authStore";
import toast from "react-hot-toast";
import type { PrendaProps } from "../components/clothing/Prenda";
import Modal from "../components/common/Modal";
import { useTranslation } from "react-i18next";

// Sacamos la instancia fuera del componente para que solo se cree una vez al cargar la app,
// si no cada vez que se actualiza un filtro vuelve a cargar todo.
const itemRepository = new SupabaseItemRepository();

export default function ClosetPage() {
  const { t } = useTranslation();
  const [prendas, setPrendas] = useState<PrendaProps[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: number, url: string } | null>(null);

  const { sessionUser } = useAuthStore();

  //Estado inicial de los filtros
  const [filters, setFilters] = useState<FilterState>({
    categoria: "",
    temporada: "",
    color: "",
    favorito: false,
  });

  //Actualizar filtro (esto va a Filter.tsx)
  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  //Resetear filtros
  const handleResetFilters = () => {
    setFilters({
      categoria: "",
      temporada: "",
      color: "",
      favorito: false,
    });
  };



  // CARGAR PRENDAS AL LLEGAR A LA PÁGINA
  useEffect(() => {
    if (!sessionUser) return;

    const loadPrendas = async () => {
      const { data, error } = await itemRepository.getPrendas(
        sessionUser.user.id
      );

      if (error) {
        console.error(error);
        return;
      }

      setPrendas(data ?? []);
    };

    loadPrendas();
  }, [sessionUser]);

  // LÓGICA DE FILTRADO
  const prendasFiltradas = prendas.filter((prenda: PrendaProps) => {
    // Si la prenda no coincide con la categoría seleccionada -> FUERA
    if (filters.categoria && prenda.categoria !== filters.categoria) return false;

    // Si la prenda no coincide con la temporada seleccionada -> FUERA
    if (filters.temporada && prenda.temporada !== filters.temporada) return false;

    // Si la prenda no coincide con el color seleccionado -> FUERA
    if (filters.color && prenda.color !== filters.color) return false;

    //Si el filtro de favorito está marcado (true) Y la prenda NO es favorita -> FUERA
    if (filters.favorito && !prenda.favorito) return false;

    // Si pasa todos los filtros -> DENTRO
    return true;
  });

  // Función para actualizar favoritos
  const handleToggleFavorito = async (id: number, estadoActual: boolean) => {
    const nuevoEstado = !estadoActual;

    // Actualización visual (corazón torna a rojo)
    setPrendas(prevPrendas =>
      prevPrendas.map(p => p.id === id ? { ...p, favorito: nuevoEstado } : p)
    );

    // Actualización en Supabase
    const { error } = await itemRepository.toggleFavorito(id, nuevoEstado);

    // Si hay fallo, revertimos el color del corazón
    if (error) {
      console.error("Error guardando favorito:", error);
      setPrendas(prevPrendas =>
        prevPrendas.map(p => p.id === id ? { ...p, favorito: estadoActual } : p)
      );
    }
  };

  // Función que abre el modal
  const openDeleteModal = (id: number, url: string) => {
    setItemToDelete({ id, url });
    setIsModalOpen(true);
  };

  const handleDeletePrenda = async () => {
    if (!itemToDelete) return;

    const { id, url } = itemToDelete;
    setIsModalOpen(false); // Cerramos el modal antes de procesar el borrado

    // Guardamos una copia por si la BBDD falla y tenemos que revertir
    const prendasAnteriores = [...prendas];

    // Actualización visual (la prenda no se muestra)
    setPrendas(prevPrendas => prevPrendas.filter(p => p.id !== id));

    const { error } = await itemRepository.deletePrenda(id, url);
    if (error) {
      console.error("Error borrando prenda:", error);

      if (error && typeof error === 'object' && 'code' in error && error.code === '23503') {
          toast.error(t('clothing.delete_error_in_outfit'));
      } else {
          toast.error(t('clothing.delete_error'));
      }
      setPrendas(prendasAnteriores); // Si falla, devolvemos la prenda a la pantalla
    } else {
      toast.success(t('clothing.delete_success'));
    }
    setItemToDelete(null); // Restauramos el estado inicial cuando se ha procesado el borrado
  };

  return (
    <>

      {/* Pasamos el estado y la función onChange al componente Filter */}
      <Filter
        width={100}
        filters={filters}
        onFilterChange={handleFilterChange}
      />


      {
        prendasFiltradas.length > 0 ? (

          <PrendasLayout
            prendas={prendasFiltradas}
            onToggleFavorito={handleToggleFavorito}
            onDelete={openDeleteModal} />
        ) : (

        // Si los filtros han dejado la lista vacía, mostramos esto:
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <p className="text-lg">{t('filter.no_results')}</p>
          <button onClick={handleResetFilters} className="text-primary-600 underline mt-4 hover:text-primary-800 transition-colors cursor-pointer">
            {t('filter.clear_filters')}
          </button>
        </div>

      )}
           {/* Si los filtros han dejado la lista vacía, mostramos esto: */}
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <p className="text-lg">No se encontraron prendas con estos filtros</p>
            <button
              onClick={handleResetFilters}
              className="text-primary-600 underline mt-4 hover:text-primary-800 transition-colors cursor-pointer"
            >
              Limpiar filtros
            </button>
          </div>
        
        
        {/* Modal para procesar la confirmación del borrado */}
        <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeletePrenda}
        title="¿Eliminar prenda?"
        message="Esta acción no se puede deshacer y la prenda desaparecerá de tu armario."
      />

    </>
  );
}
