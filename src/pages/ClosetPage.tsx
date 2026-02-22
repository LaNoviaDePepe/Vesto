import { useEffect, useState } from "react";
import Filter, { type FilterState } from "../components/filter/Filter";
import PrendasLayout from "../layouts/PrendasLayout";
import { SupabaseItemRepository } from "../database/supabase/SupabaseItemRepository";
import { useAuthStore } from "../stores/authStore";

import type { PrendaProps } from "../components/clothing/Prenda";

// Sacamos la instancia fuera del componente para que solo se cree una vez al cargar la app,
// si no cada vez que se actualiza un filtro vuelve a cargar todo.
const itemRepository = new SupabaseItemRepository();

export default function ClosetPage() {

  const [prendas, setPrendas] = useState<PrendaProps[]>([]);

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

  return (
    <>

      {/* Pasamos el estado y la función onChange al componente Filter */}
      <Filter
        width={100}
        filters={filters}
        onFilterChange={handleFilterChange}
      />


      {prendasFiltradas.length > 0 ? (

        <PrendasLayout prendas={prendasFiltradas} onToggleFavorito={handleToggleFavorito} />

      ) : (

        // Si los filtros han dejado la lista vacía, mostramos esto:
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <p className="text-lg">No se encontraron prendas con estos filtros</p>
          <button
            onClick={handleResetFilters}
            className="text-primary-600 underline mt-4 hover:text-primary-800 transition-colors cursor-pointer"
          >
            Limpiar filtros
          </button>
        </div>

      )}

    </>
  );
}
