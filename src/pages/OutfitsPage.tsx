import { useEffect, useState } from "react";
import Conjunto from "../components/clothing/Conjunto";
import { SupabaseOutfitRepository } from "../database/supabase/SupabaseOutfitRepository";
import { useAuthStore } from "../stores/authStore";

export default function OutfitsPage() {

  const [conjuntos, setConjuntos] = useState<any[]>([]);
  const outfitRepository = new SupabaseOutfitRepository();
  const { sessionUser } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {

      if (!sessionUser) return;

      const { data, error } = await outfitRepository.getConjuntos(sessionUser.user.id);

      if (error) {
        console.error(error);
      } else {
        setConjuntos(data);
      }

      setLoading(false);
    }

    load();
  }, []);

  if (loading) return <div>Loading outfits...</div>;

  const handleToggleFavorito = async (id: number, estadoActual: boolean) => {
  const nuevoEstado = !estadoActual;

    // Actualización visual (corazón torna a rojo)
    setConjuntos(prevConjuntos => 
      prevConjuntos.map(c => c.id === id ? { ...c, favorito: nuevoEstado } : c)
    );

    // Actualización en Supabase
    const { error } = await outfitRepository.isFavorito(id, nuevoEstado);
    
    // Si hay fallo, revertimos el color del corazón
    if (error) {
      console.error("Error guardando favorito:", error);
      setConjuntos(prevConjuntos => 
        prevConjuntos.map(c => c.id === id ? { ...c, favorito: estadoActual } : c)
      );
    }
  };

  return (
    <div className="flex flex-col gap-10 px-10">
      {conjuntos.map(conjunto => (
        // Spread operator, en vez de pasar uno a uno
        <Conjunto
          key={conjunto.id}
          {...conjunto}
          toggleFavorito={handleToggleFavorito} />
        
      ))}
    </div>
  );
}
