import { useEffect, useState } from "react";
import Filter from "../components/filter/Filter";
import PrendasLayout from "../layouts/PrendasLayout";
import { SupabaseItemRepository } from "../database/supabase/SupabaseItemRepository";
import { useAuthStore } from "../stores/authStore";
import { useFilterStore } from "../stores/filterStore"; 


export default function ClosetPage() {
  const [prendas, setPrendas] = useState([]);

  const { filters, resetFilters } = useFilterStore();

  const itemRepository = new SupabaseItemRepository();
  const { sessionUser } = useAuthStore();

  // LIMPIAR FILTROS AL CAMBIAR DE PÁGINA
  useEffect(() => {
    return () => {
        resetFilters();
    };
  }, [resetFilters]);

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
  const prendasFiltradas = prendas.filter((prenda: any) => {
      // Si la prenda no coincide con la categoría seleccionada -> FUERA
      if (filters.categoria && prenda.categoria !== filters.categoria) return false;
      
      // Si la prenda no coincide con la temporada seleccionada -> FUERA
      if (filters.temporada && prenda.temporada !== filters.temporada) return false;
      
      // Si la prenda no coincide con el color seleccionado -> FUERA
      if (filters.color && prenda.color !== filters.color) return false;

      // Si pasa todos los filtros -> DENTRO
      return true;
  });

  return (
    <>
      <Filter width={100} />
      <PrendasLayout prendas={prendasFiltradas} />
    </>
  );
}


/* ={[
          { name: "Camiseta blanca", url: "/img/prenda.jpg", color: "blanco", temporada: "verano" },
          { name: "Pantalón negro", url: "/img/prenda.jpg", color: "negro", temporada: "invierno" },
          { name: "Camiseta blanca", url: "error", color: "blanco", temporada: "verano" },
          { name: "Chaqueta roja", url: "/img/prenda.jpg", color: "rojo", temporada: "otoño" },
          { name: "Sombrero azul", url: "/img/prenda.jpg", color: "azul", temporada: "primavera" },
          { name: "Pantalón negro", url: "/img/prenda.jpg", color: "negro", temporada: "invierno" },
          { name: "Chaqueta roja", url: "/img/prenda.jpg", color: "rojo", temporada: "otoño" },
          { name: "Camiseta blanca", url: "/img/prenda.jpg", color: "blanco", temporada: "verano" },
          { name: "Pantalón negro", url: "/img/prenda.jpg", color: "negro", temporada: "invierno" },
          { name: "Camiseta blanca", url: "error", color: "blanco", temporada: "verano" },
          { name: "Chaqueta roja", url: "/img/prenda.jpg", color: "rojo", temporada: "otoño" },
          { name: "Sombrero azul", url: "/img/prenda.jpg", color: "azul", temporada: "primavera" },
          { name: "Pantalón negro", url: "/img/prenda.jpg", color: "negro", temporada: "invierno" },
          { name: "Chaqueta roja", url: "/img/prenda.jpg", color: "rojo", temporada: "otoño" },
          { name: "Camiseta blanca", url: "/img/prenda.jpg", color: "blanco", temporada: "verano" },
          { name: "Pantalón negro", url: "/img/prenda.jpg", color: "negro", temporada: "invierno" },
          { name: "Camiseta blanca", url: "error", color: "blanco", temporada: "verano" },
          { name: "Chaqueta roja", url: "/img/prenda.jpg", color: "rojo", temporada: "otoño" },
          { name: "Sombrero azul", url: "/img/prenda.jpg", color: "azul", temporada: "primavera" },
          { name: "Pantalón negro", url: "/img/prenda.jpg", color: "negro", temporada: "invierno" },
          { name: "Chaqueta roja", url: "/img/prenda.jpg", color: "rojo", temporada: "otoño" },
        ]} */
