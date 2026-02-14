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

  return (
    <div className="flex flex-col gap-10 px-10">
      {conjuntos.map(conjunto => (
        <Conjunto
          key={conjunto.id}
          name={conjunto.nombre}
          descripcion={conjunto.descripcion}
          prendas={conjunto.prendas}
          url="/img/conjunto.png"
        />
      ))}
    </div>
  );
}
