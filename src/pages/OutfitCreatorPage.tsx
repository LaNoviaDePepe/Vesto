import { useEffect, useState } from "react";
import Filter, { type FilterState } from "../components/filter/Filter";
import Prenda, { type PrendaProps } from "../components/clothing/Prenda";
import AddOutfitForm from "../components/forms/AddOutfitForm";
import { SupabaseItemRepository } from "../database/supabase/SupabaseItemRepository";
import { useAuthStore } from "../stores/authStore";
import { useTranslation } from "react-i18next";

const itemRepository = new SupabaseItemRepository();

/**
 * Componente `OutfitCreatorPage`.
 * * Interfaz principal para la creación de conjuntos.
 * Divide la pantalla en dos columnas (Armario y Formulario). 
 * Permite seleccionar prendas y enviarlas al formulario para guardar un nuevo "Outfit".
 * Soporte completo de Modo Oscuro en fondos, paneles y textos.
 * @returns {JSX.Element} Vista del creador de outfits.
 */
export default function OutfitCreatorPage() {
  const { t } = useTranslation();
  const { sessionUser } = useAuthStore();

  const [prendas, setPrendas] = useState<PrendaProps[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    categoria: "", temporada: "", color: "", favorito: false,
  });

  const [outfit, setOutfit] = useState<Record<string, PrendaProps | null>>({
    cabeza: null, parte_arriba: null, parte_abajo: null, complemento: null, calzado: null,
  });

  useEffect(() => {
    if (!sessionUser) return;
    const loadPrendas = async () => {
      const { data } = await itemRepository.getPrendas(sessionUser.user.id);
      const prendasAdaptadas: PrendaProps[] = (data || []).map((p: any) => ({
        id: p.id, id_usuario: sessionUser.user.id, name: p.name, url: p.url,
        categoria: p.categoria, color: p.color, temporada: p.temporada, favorito: p.favorito
      }));
      setPrendas(prendasAdaptadas);
    };
    loadPrendas();
  }, [sessionUser]);

  const handleSelectPrenda = (prenda: PrendaProps) => {
    setOutfit((prev) => ({
      ...prev,
      [prenda.categoria]: prev[prenda.categoria]?.id === prenda.id ? null : prenda,
    }));
  };

  const resetOutfit = () => {
    setOutfit({ cabeza: null, parte_arriba: null, parte_abajo: null, complemento: null, calzado: null });
  };

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ categoria: "", temporada: "", color: "", favorito: false });
  };

  const prendasFiltradas = prendas.filter(p => {
    if (filters.categoria && p.categoria !== filters.categoria) return false;
    if (filters.temporada && p.temporada !== filters.temporada) return false;
    if (filters.color && p.color !== filters.color) return false;
    if (filters.favorito && !p.favorito) return false;
    return true;
  });

  const handleToggleFavorito = async (id: number, estadoActual: boolean) => {
    const nuevoEstado = !estadoActual;
    setPrendas(prev => prev.map(p => p.id === id ? { ...p, favorito: nuevoEstado } : p));
    const { error } = await itemRepository.toggleFavorito(id, nuevoEstado);
    if (error) setPrendas(prev => prev.map(p => p.id === id ? { ...p, favorito: estadoActual } : p));
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] bg-primary-300 dark:bg-gray-950 transition-colors duration-300">
      {/* COLUMNA IZQUIERDA: ARMARIO */}
      <div className="lg:w-1/2 flex flex-col   overflow-hidden border-b border-gray-100 dark:border-gray-800 lg:border-b-0 lg:border-r lg:h-full transition-colors duration-300">
        <Filter width={100} filters={filters} onFilterChange={handleFilterChange} />
        
        <div className="flex-1 overflow-y-auto p-6 mt-15  md:mt-0 bg-gray-50/50 dark:bg-gray-900/50 transition-colors duration-300" id="closet-container">
          <div className="flex flex-wrap gap-6 pt-10 justify-center">
            {prendasFiltradas.length > 0 ? (
              prendasFiltradas.map((prenda) => (
                <div
                  key={prenda.id}
                  onClick={() => handleSelectPrenda(prenda)}
                  className={`cursor-pointer transition-all duration-200 rounded-xl ${
                    outfit[prenda.categoria]?.id === prenda.id 
                    ? 'ring-4 ring-primary-700 dark:ring-primary-500 shadow-lg scale-105' 
                    : 'hover:opacity-80'
                  }`}
                >
                  <Prenda {...prenda} onToggleFavorito={handleToggleFavorito} />
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-500 w-full transition-colors duration-300">
                <p className="text-lg">{t('filter.no_results')}</p>
                <button onClick={handleResetFilters} className="text-primary-600 dark:text-primary-400 underline mt-4 hover:text-primary-800 dark:hover:text-primary-300 transition-colors cursor-pointer">
                  {t('filter.clear_filters')}
                </button>
              </div>
            )}

          </div>        
        </div>
      </div>

      {/* COLUMNA DERECHA: FORMULARIO */}
      <div className="lg:w-1/2 lg:fixed lg:right-0 flex-1 overflow-y-auto p-4 lg:p-6  text-gray-900 dark:text-white transition-colors duration-300">
        <AddOutfitForm
          outfit={outfit}
          onResetOutfit={resetOutfit} />
      </div>
    </div>
  );
}