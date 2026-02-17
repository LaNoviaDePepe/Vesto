import { useEffect, useState } from "react";
import { CircleChevronUp } from "lucide-react";
import Filter from "../components/filter/Filter";
import Prenda from "../components/clothing/Prenda";
import Button from "../components/common/Button";
import { SupabaseOutfitRepository } from "../database/supabase/SupabaseOutfitRepository";
import { SupabaseItemRepository } from "../database/supabase/SupabaseItemRepository"; 
import { useAuthStore } from "../stores/authStore"; 
import { useFilterStore } from "../stores/filterStore"; 
import { OutfitSlot } from "../components/clothing/OutfitSlot";

type CategoriaPrenda = "cabeza" | "parte_arriba" | "parte_abajo" | "complemento" | "calzado";
type ColorPrenda = "negro" | "blanco" | "gris" | "rojo" | "azul" | "amarillo" | "verde" | "naranja" | "morado" | "rosa" | "marron" | "celeste" | "turquesa" | "beige" | "dorado" | "plateado";
type TemporadaPrenda = "otonio" | "invierno" | "primavera" | "verano" | "todo";


interface PrendaBD {
  id: string | number;
  id_usuario: string;
  nombre: string;    
  categoria: CategoriaPrenda;
  color: ColorPrenda;
  url_imagen: string; 
  temporada: TemporadaPrenda;
  favorito: boolean;
}

const outfitRepo = new SupabaseOutfitRepository();
const itemRepository = new SupabaseItemRepository();

export default function OutfitCreatorPage() {

  const { sessionUser } = useAuthStore();
  const { filters, resetFilters } = useFilterStore();

  const [prendas, setPrendas] = useState<PrendaBD[]>([]); // Lista de la izquierda
  const [loading, setLoading] = useState(false);
  const [nombreConjunto, setNombreConjunto] = useState("");

  // ESATADO DEL OUTFIT (Derecha)
  const [outfit, setOutfit] = useState<Record<CategoriaPrenda, PrendaBD | null>>({
    cabeza: null,
    parte_arriba: null,
    parte_abajo: null,
    complemento: null,
    calzado: null,
  });

  // --- CARGA DE PRENDAS DEL ARMARIO (IZQUIERDA) ---
  useEffect(() => {
    if (!sessionUser) return;

    const loadPrendas = async () => {
      const { data, error } = await itemRepository.getPrendas(sessionUser.user.id);

      if (error) {
        console.error("Error cargando armario:", error);
        return;
      }

      const prendasAdaptadas: PrendaBD[] = (data || []).map((p: any) => ({
        id: p.id,
        id_usuario: sessionUser.user.id,
        nombre: p.name,       
        url_imagen: p.url,   
        categoria: p.categoria,
        color: p.color,
        temporada: p.temporada,
        favorito: p.favorito || false
      }));

      setPrendas(prendasAdaptadas);
    };

    loadPrendas();

    // Limpieza de filtros al cambiar de página
    return () => {
      resetFilters();
    };
  }, [sessionUser, resetFilters]);


  // LÓGICA DE FILTRADO 
  const prendasFiltradas = prendas.filter((prenda) => {
    if (filters.categoria && prenda.categoria !== filters.categoria) return false;
    if (filters.temporada && prenda.temporada !== filters.temporada) return false;
    if (filters.color && prenda.color !== filters.color) return false;
    return true;
  });


  // LÓGICA DE SELECCIÓN Y GUARDADO 
  const handleSelectPrenda = (prenda: PrendaBD) => {
    setOutfit((estadoprevio) => {
      // Si la prenda ya está seleccionada en su categoría, la quitamos
      const isAlreadySelected = estadoprevio[prenda.categoria]?.id === prenda.id;
      return {
        ...estadoprevio,
        [prenda.categoria]: isAlreadySelected ? null : prenda,
      };
    });
  };

  const handleSaveOutfit = async () => {
    const prendasSeleccionadas = Object.values(outfit).filter((p): p is PrendaBD => p !== null);

    if (!nombreConjunto.trim()) return alert("Ponle un nombre al conjunto");
    if (prendasSeleccionadas.length === 0) return alert("Selecciona al menos una prenda");

    setLoading(true);

    const { error } = await outfitRepo.createConjunto({
      nombre: nombreConjunto,
      id_usuario: sessionUser?.user.id || "",
      prendasIds: prendasSeleccionadas.map(p => p.id),
      favorito: false
    });

    setLoading(false);

    if (error) {
      alert("Error al guardar");
    } else {
      alert("¡Conjunto guardado!");
      setNombreConjunto("");
      setOutfit({ cabeza: null, parte_arriba: null, parte_abajo: null, complemento: null, calzado: null });
    }
  };

  const scrollToTopArmario = () => {
    document.getElementById("closet-container")?.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden bg-primary-300 ">

      {/* COLUMNA IZQUIERDA: ARMARIO */}
      <div className="relative flex-1 flex flex-col overflow-hidden border-r border-gray-100">

        {/* Barra de Filtros */}
        <Filter width={100} />

        <div className="pt-20 flex-1 overflow-y-auto p-6 bg-gray-50/50" id="closet-container">
          <div className="flex flex-wrap gap-6 justify-center">

            {/* Mapeo de Prendas FILTRADAS */}
            {(
              prendasFiltradas.map((prenda) => (
                <div
                  key={prenda.id}
                  onClick={() => handleSelectPrenda(prenda)}
                  className={`cursor-pointer transition-all duration-200 hover:opacity-80`}
                >
                  <Prenda
                    name={prenda.nombre}
                    url={prenda.url_imagen}
                    color={prenda.color}
                    temporada={prenda.temporada}
                    categoria={prenda.categoria}
                  />
                </div>
              ))
            )}

          </div>

          {/* Botón flotante para subir */}
          <div className="absolute bottom-6 right-6 z-20">
            <Button variant="out" className="border-0 p-0" onClick={scrollToTopArmario}>
              <CircleChevronUp size={32} className="text-white bg-auxiliary-700 rounded-full hover:bg-primary-700 transition-colors" />
            </Button>
          </div>
        </div>
      </div>

      {/* COLUMNA DERECHA: CREADOR */}
      <div className="w-full lg:w-125 xl:w-150 bg-auxiliary-50 flex flex-col p-8 h-svh ">
        <div className="flex gap-3 mb-10">
          <input
            type="text"
            placeholder="Nombre del conjunto"
            className="flex-1 px-4 py-3 rounded-xl border-2 border-primary-100 bg-white shadow-sm"
            value={nombreConjunto}
            disabled={loading}
            onChange={(e) => setNombreConjunto(e.target.value)}
          />
          <Button variant="primary" onClick={handleSaveOutfit} disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </div>

        {/* Grid de Slots */}
        <div className="flex flex-col gap-8 items-center">
          <div className="flex justify-center gap-6 w-full">
            <OutfitSlot label="Cabeza" item={outfit.cabeza} />
            <OutfitSlot label="Parte Arriba" item={outfit.parte_arriba} />
            <OutfitSlot label="Complemento" item={outfit.complemento} />
          </div>
          <div className="flex justify-center gap-6 w-full">
            <OutfitSlot label="Parte Abajo" item={outfit.parte_abajo} />
            <OutfitSlot label="Calzado" item={outfit.calzado} />
          </div>
        </div>
      </div>
    </div>
  );
}




// const mockPrendasBD: PrendaBD[] = [
//   // --- CATEGORÍA: CABEZA (7) ---
//   { id: 1, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Gorro Lana", categoria: "cabeza", color: "azul", temporada: "invierno", url_imagen: "/img/prenda.jpg", favorito: false },
//   { id: 2, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Gorra Trucker", categoria: "cabeza", color: "negro", temporada: "verano", url_imagen: "/img/prenda.jpg", favorito: true },
//   { id: 3, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Sombrero Paja", categoria: "cabeza", color: "beige", temporada: "verano", url_imagen: "/img/prenda.jpg", favorito: false },
//   { id: 4, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Beanie Gris", categoria: "cabeza", color: "gris", temporada: "invierno", url_imagen: "/img/prenda.jpg", favorito: false },
//   { id: 5, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Boina Roja", categoria: "cabeza", color: "rojo", temporada: "otonio", url_imagen: "/img/prenda.jpg", favorito: false },
//   { id: 6, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Visera Running", categoria: "cabeza", color: "blanco", temporada: "verano", url_imagen: "/img/prenda.jpg", favorito: false },
//   { id: 7, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Gorro Pescador", categoria: "cabeza", color: "verde", temporada: "primavera", url_imagen: "/img/prenda.jpg", favorito: true },

//   // --- CATEGORÍA: PARTE ARRIBA (7) ---
//   { id: 8, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Sudadera Hoodie", categoria: "parte_arriba", color: "gris", temporada: "invierno", url_imagen: "/img/prenda.jpg", favorito: false },
//   { id: 9, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Camiseta Básica", categoria: "parte_arriba", color: "blanco", temporada: "verano", url_imagen: "/img/prenda.jpg", favorito: true },
//   { id: 10, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Chaqueta Cuero", categoria: "parte_arriba", color: "negro", temporada: "otonio", url_imagen: "/img/prenda.jpg", favorito: false },
//   { id: 11, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Camisa Lino", categoria: "parte_arriba", color: "celeste", temporada: "verano", url_imagen: "/img/prenda.jpg", favorito: false },
//   { id: 12, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Jersey Lana", categoria: "parte_arriba", color: "marron", temporada: "invierno", url_imagen: "/img/prenda.jpg", favorito: false },
//   { id: 13, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Polo Piqué", categoria: "parte_arriba", color: "azul", temporada: "primavera", url_imagen: "/img/prenda.jpg", favorito: false },
//   { id: 14, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Top Tirantes", categoria: "parte_arriba", color: "rosa", temporada: "verano", url_imagen: "/img/prenda.jpg", favorito: false },

//   // --- CATEGORÍA: PARTE ABAJO (7) ---
//   { id: 15, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Vaqueros Slim", categoria: "parte_abajo", color: "azul", temporada: "todo", url_imagen: "/img/prenda.jpg", favorito: true },
//   { id: 16, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Pantalón Cargo", categoria: "parte_abajo", color: "verde", temporada: "otonio", url_imagen: "/img/prenda.jpg", favorito: false },
//   { id: 17, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Shorts Deporte", categoria: "parte_abajo", color: "naranja", temporada: "verano", url_imagen: "/img/prenda.jpg", favorito: false },
//   { id: 18, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Falda Plisada", categoria: "parte_abajo", color: "negro", temporada: "primavera", url_imagen: "/img/prenda.jpg", favorito: false },
//   { id: 19, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Chándal Gris", categoria: "parte_abajo", color: "gris", temporada: "invierno", url_imagen: "/img/prenda.jpg", favorito: false },
//   { id: 20, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Bermudas Chino", categoria: "parte_abajo", color: "beige", temporada: "verano", url_imagen: "/img/prenda.jpg", favorito: false },
//   { id: 21, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Pantalón Pinzas", categoria: "parte_abajo", color: "morado", temporada: "otonio", url_imagen: "/img/prenda.jpg", favorito: false },

//   // --- CATEGORÍA: COMPLEMENTO (7) ---
//   { id: 22, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Gafas Retro", categoria: "complemento", color: "negro", temporada: "verano", url_imagen: "/img/prenda.jpg", favorito: false },
//   { id: 23, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Reloj Plata", categoria: "complemento", color: "plateado", temporada: "todo", url_imagen: "/img/prenda.jpg", favorito: true },
//   { id: 24, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Cinturón Piel", categoria: "complemento", color: "marron", temporada: "todo", url_imagen: "/img/prenda.jpg", favorito: false },
//   { id: 25, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Bufanda Cuadros", categoria: "complemento", color: "rojo", temporada: "invierno", url_imagen: "/img/prenda.jpg", favorito: false },
//   { id: 26, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Mochila Lona", categoria: "complemento", color: "amarillo", temporada: "primavera", url_imagen: "/img/prenda.jpg", favorito: false },
//   { id: 27, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Pendientes Aro", categoria: "complemento", color: "dorado", temporada: "todo", url_imagen: "/img/prenda.jpg", favorito: false },
//   { id: 28, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Bolso Mano", categoria: "complemento", color: "turquesa", temporada: "verano", url_imagen: "/img/prenda.jpg", favorito: false },

//   // --- CATEGORÍA: CALZADO (7) ---
//   { id: 29, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Sneakers White", categoria: "calzado", color: "blanco", temporada: "primavera", url_imagen: "/img/prenda.jpg", favorito: true },
//   { id: 30, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Botas Militares", categoria: "calzado", color: "negro", temporada: "invierno", url_imagen: "/img/prenda.jpg", favorito: false },
//   { id: 31, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Sandalias Playa", categoria: "calzado", color: "marron", temporada: "verano", url_imagen: "/img/prenda.jpg", favorito: false },
//   { id: 32, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Zapatos Oxford", categoria: "calzado", color: "azul", temporada: "otonio", url_imagen: "/img/prenda.jpg", favorito: false },
//   { id: 33, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Mocasines Suede", categoria: "calzado", color: "beige", temporada: "primavera", url_imagen: "/img/prenda.jpg", favorito: false },
//   { id: 34, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Botines Piel", categoria: "calzado", color: "negro", temporada: "invierno", url_imagen: "/img/prenda.jpg", favorito: false },
//   { id: 35, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Chanclas Goma", categoria: "calzado", color: "amarillo", temporada: "verano", url_imagen: "/img/prenda.jpg", favorito: false },
// ];