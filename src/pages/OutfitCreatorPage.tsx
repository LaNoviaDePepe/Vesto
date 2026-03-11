import { useEffect, useState } from "react";
import Filter, { type FilterState } from "../components/filter/Filter";
import Prenda, { type PrendaProps } from "../components/clothing/Prenda";
import Button from "../components/common/Button";
import AddOutfitForm from "../components/forms/AddOutfitForm";
import { SupabaseItemRepository } from "../database/supabase/SupabaseItemRepository";
import { CircleChevronUp } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";


const itemRepository = new SupabaseItemRepository();

export default function OutfitCreatorPage() {
  const { t } = useTranslation();
  const { sessionUser } = useAuthStore();

  const [prendas, setPrendas] = useState<PrendaProps[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    categoria: "",
    temporada: "",
    color: "",
    favorito: false,
  });

  // El estado del outfit se queda aquí (en lugar de pasar a AddOutfitForm) porque se alimenta del click en las prendas (izquierda)
  const [outfit, setOutfit] = useState<Record<string, PrendaProps | null>>({
    cabeza: null,
    parte_arriba: null,
    parte_abajo: null,
    complemento: null,
    calzado: null,
  });

  useEffect(() => {
    if (!sessionUser) return;
    // CARGA DE PRENDAS
    const loadPrendas = async () => {
      const { data } = await itemRepository.getPrendas(sessionUser.user.id);
      const prendasAdaptadas: PrendaProps[] = (data || []).map((p: any) => ({
        id: p.id,
        id_usuario: sessionUser.user.id,
        name: p.name,
        url: p.url,
        categoria: p.categoria,
        color: p.color,
        temporada: p.temporada,
        favorito: p.favorito
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

  // Función para actualizar favoritos
  const handleToggleFavorito = async (id: number, estadoActual: boolean) => {
    const nuevoEstado = !estadoActual;
    setPrendas(prev => prev.map(p => p.id === id ? { ...p, favorito: nuevoEstado } : p));
    const { error } = await itemRepository.toggleFavorito(id, nuevoEstado);
    if (error) setPrendas(prev => prev.map(p => p.id === id ? { ...p, favorito: estadoActual } : p));
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden bg-primary-300 ">

      {/* COLUMNA IZQUIERDA: ARMARIO */}
      <div className="relative flex-1 flex flex-col overflow-hidden border-r border-gray-100">
        <Filter
          width={100}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50" id="closet-container">
          <div className="flex flex-wrap gap-6 justify-center">
            {prendasFiltradas.length > 0 ? (
              prendasFiltradas.map((prenda) => (
                <div
                  key={prenda.id}
                  onClick={() => handleSelectPrenda(prenda)}
                  className={`cursor-pointer transition-all duration-200 rounded-xl ${
                    outfit[prenda.categoria]?.id === prenda.id 
                    ? 'ring-4 ring-primary-700 shadow-lg scale-105' 
                    : 'hover:opacity-80'
                  }`}
                >
                  <Prenda {...prenda} onToggleFavorito={handleToggleFavorito} />
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400 w-full">
                <p className="text-lg">{t('filter.no_results')}</p>
                <button 
                  onClick={handleResetFilters} 
                  className="text-primary-600 underline mt-4 hover:text-primary-800 transition-colors cursor-pointer"
                >
                  {t('filter.clear_filters')}
                </button>
              </div>
            )}

          </div>
          
          {/* Botón de subida del contenedor de prendas */}
          <div className="absolute bottom-6 right-6 z-20">
            <Button variant="icon" onClick={() => document.getElementById("closet-container")?.scrollTo({ top: 0, behavior: 'smooth' })}>
              <CircleChevronUp size={28} className="text-white bg-auxiliary-700 rounded-full hover:bg-primary-700" />
            </Button>
          </div>
        </div>
      </div>

       {/* COLUMNA DERECHA: FORMULARIO */}
      <AddOutfitForm
        outfit={outfit}
        onResetOutfit={resetOutfit} />
    </div>
  );
}