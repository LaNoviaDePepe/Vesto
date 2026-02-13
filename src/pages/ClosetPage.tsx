import { useEffect, useState } from "react";
import Filter from "../components/filter/Filter";
import PrendasLayout from "../layouts/PrendasLayout";
import { SupabaseItemRepository } from "../database/supabase/SupabaseItemRepository";
import { useAuthStore } from "../stores/authStore";


export default function ClosetPage() {
  const [prendas, setPrendas] = useState([]);

  const itemRepository = new SupabaseItemRepository();
  const { sessionUser } = useAuthStore();

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


  return (
    <>
      <Filter width={100} />
      <PrendasLayout prendas={prendas || []} />
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
