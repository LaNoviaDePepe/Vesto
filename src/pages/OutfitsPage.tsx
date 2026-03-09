import { useEffect, useState } from "react";
import Conjunto from "../components/clothing/Conjunto";
import { SupabaseOutfitRepository } from "../database/supabase/SupabaseOutfitRepository";
import { useAuthStore } from "../stores/authStore";
import toast from "react-hot-toast";

export default function OutfitsPage() {

  const [conjuntos, setConjuntos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const outfitRepository = new SupabaseOutfitRepository();
  const { sessionUser } = useAuthStore();


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

  // Función para eliminar conjunto con borrado optimista (visualmente es automático, asumimos que será exitoso, pero podemos revertirlo) y toast
  const handleDeleteConjunto = async (id: number, url_imagen: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este conjunto?")) return;

    // Guardamos una copia por si la BBDD falla y tenemos que revertir
    const conjuntosAnteriores = [...conjuntos];

    // Actualización visual inmediata 
    setConjuntos(prevConjuntos => prevConjuntos.filter(c => c.id !== id));

    const { error } = await outfitRepository.deleteConjunto(id, url_imagen);

    if (error) {
      console.error("Error borrando conjunto:", error);
      toast.error("Hubo un problema al eliminar el conjunto");
      // Si falla, devolvemos el conjunto a la pantalla
      setConjuntos(conjuntosAnteriores);
    } else {
      toast.success("Conjunto eliminado correctamente");
    }
  };

  return (
    <div className="flex flex-col gap-10 px-10">
      {conjuntos.length > 0 ? (
        conjuntos.map(conjunto => (
          <Conjunto
            key={conjunto.id}
            {...conjunto}
            toggleFavorito={handleToggleFavorito}
            onDelete={handleDeleteConjunto}
          />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <p className="text-lg">Aún no has creado ningún conjunto</p>
        </div>
      )}
    </div>
  );
}

