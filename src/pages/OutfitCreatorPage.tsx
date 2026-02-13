import { useState } from "react";
import Filter from "../components/filter/Filter";
import Prenda from "../components/clothing/Prenda";
import Button from "../components/common/Button";
import { SupabaseOutfitRepository } from "../database/supabase/SupabaseOutfitRepository";

type CategoriaPrenda = "cabeza" | "parte_arriba" | "parte_abajo" | "complemento" | "calzado";
type ColorPrenda = "negro" | "blanco" | "gris" | "rojo" | "azul" | "amarillo" | "verde" | "naranja" | "morado" | "rosa" | "marron" | "celeste" | "turquesa" | "beige" | "dorado" | "plateado";
type TemporadaPrenda = "otonio" | "invierno" | "primavera" | "verano" | "todo";

interface PrendaBD {
  id: number;
  id_usuario: string; 
  nombre: string;
  categoria: CategoriaPrenda;
  color: ColorPrenda;
  url_imagen: string;
  temporada: TemporadaPrenda;
  favorito: boolean;
}

interface OutfitCreatorPageProps {
  userId: string;
}

const outfitRepo = new SupabaseOutfitRepository();

export default function OutfitCreatorPage({ userId="4e9535ea-72b9-4dd2-8d96-e185da7c0d33" }: OutfitCreatorPageProps) {
  const [nombreConjunto, setNombreConjunto] = useState("");
  const [loading, setLoading] = useState(false);
  const [outfit, setOutfit] = useState<Record<CategoriaPrenda, PrendaBD | null>>({
    cabeza: null,
    parte_arriba: null,
    parte_abajo: null,
    complemento: null,
    calzado: null,
  });

  const handleSelectPrenda = (prenda: PrendaBD) => {
    setOutfit((estadoprevio) => {
      const isAlreadySelected = estadoprevio[prenda.categoria]?.id === prenda.id;
      return {
        ...estadoprevio,
        [prenda.categoria]: isAlreadySelected ? null : prenda,
      };
    });
  };

  /**
   * Lógica de guardado conectada a Supabase
   */
  const handleSaveOutfit = async () => {
    const prendasSeleccionadas = Object.values(outfit).filter((p): p is PrendaBD => p !== null);

    // 1. Validaciones previas
    if (!nombreConjunto.trim()) return alert("Por favor, introduce un nombre para el conjunto.");
    if (prendasSeleccionadas.length === 0) return alert("Debes seleccionar al menos una prenda.");

    setLoading(true);

    // 2. Llamada al repositorio
    const { error } = await outfitRepo.createConjunto({
      nombre: nombreConjunto,
      id_usuario: userId, 
      prendasIds: prendasSeleccionadas.map(p => p.id), 
      favorito: false
    });

    setLoading(false);

    if (error) {
      alert("Hubo un error al guardar el conjunto.");
    } else {
      alert(`¡Conjunto '${nombreConjunto}' guardado con éxito!`);

      setNombreConjunto("");
      setOutfit({
        cabeza: null,
        parte_arriba: null,
        parte_abajo: null,
        complemento: null,
        calzado: null,
      });
    }
  };

  return (
    
    <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden bg-primary-300 ">
      
      {/* COLUMNA IZQUIERDA: ARMARIO */}
      <div className="flex-1 flex flex-col overflow-hidden border-r border-gray-100">
        <Filter width={100} />
        <div className="flex-1 overflow-y-auto p-6  bg-gray-50/50">
          <div className="flex flex-wrap gap-6 justify-center">
            {mockPrendasBD
              .filter(p => p.id_usuario === userId)
              .map((prenda) => (
                <div
                  key={prenda.id}
                  onClick={() => handleSelectPrenda(prenda)}
                  className={`cursor-pointer transition-all duration-200 ${
                    outfit[prenda.categoria]?.id === prenda.id ? 'ring-4 ring-primary-700 rounded-xl shadow-lg' : 'hover:opacity-80'
                  }`}
                >
                  <Prenda 
                    name={prenda.nombre} 
                    url={prenda.url_imagen} 
                    color={prenda.color} 
                    temporada={prenda.temporada} 
                  />
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* COLUMNA DERECHA: CREADOR (GRID DE SLOTS) */}
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

        {/* Disposición de Slots en Grid sin Maniquí */}
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

/**
 * Componente de Slot simplificado para el Grid
 */
function OutfitSlot({ label, item }: { label: string; item: PrendaBD | null }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[10px] font-bold text-primary-700 uppercase">{label}</span>
      <div className={`w-28 h-36 bg-white border-2 rounded-2xl flex items-center justify-center p-2 shadow-sm transition-all ${
        item ? 'border-primary-700 shadow-md' : 'border-dashed border-gray-300'
      }`}>
        <div className="w-full h-full bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center border border-gray-100">
          {item ? (
            <img src={item.url_imagen} alt={item.nombre} className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-300 text-3xl font-light">+</span>
          )}
        </div>
      </div>
    </div>
  );
}

const mockPrendasBD: PrendaBD[] = [
  // --- CATEGORÍA: CABEZA (7) ---
  { id: 1, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Gorro Lana", categoria: "cabeza", color: "azul", temporada: "invierno", url_imagen: "/img/prenda.jpg", favorito: false },
  { id: 2, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Gorra Trucker", categoria: "cabeza", color: "negro", temporada: "verano", url_imagen: "/img/prenda.jpg", favorito: true },
  { id: 3, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Sombrero Paja", categoria: "cabeza", color: "beige", temporada: "verano", url_imagen: "/img/prenda.jpg", favorito: false },
  { id: 4, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Beanie Gris", categoria: "cabeza", color: "gris", temporada: "invierno", url_imagen: "/img/prenda.jpg", favorito: false },
  { id: 5, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Boina Roja", categoria: "cabeza", color: "rojo", temporada: "otonio", url_imagen: "/img/prenda.jpg", favorito: false },
  { id: 6, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Visera Running", categoria: "cabeza", color: "blanco", temporada: "verano", url_imagen: "/img/prenda.jpg", favorito: false },
  { id: 7, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Gorro Pescador", categoria: "cabeza", color: "verde", temporada: "primavera", url_imagen: "/img/prenda.jpg", favorito: true },

  // --- CATEGORÍA: PARTE ARRIBA (7) ---
  { id: 8, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Sudadera Hoodie", categoria: "parte_arriba", color: "gris", temporada: "invierno", url_imagen: "/img/prenda.jpg", favorito: false },
  { id: 9, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Camiseta Básica", categoria: "parte_arriba", color: "blanco", temporada: "verano", url_imagen: "/img/prenda.jpg", favorito: true },
  { id: 10, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Chaqueta Cuero", categoria: "parte_arriba", color: "negro", temporada: "otonio", url_imagen: "/img/prenda.jpg", favorito: false },
  { id: 11, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Camisa Lino", categoria: "parte_arriba", color: "celeste", temporada: "verano", url_imagen: "/img/prenda.jpg", favorito: false },
  { id: 12, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Jersey Lana", categoria: "parte_arriba", color: "marron", temporada: "invierno", url_imagen: "/img/prenda.jpg", favorito: false },
  { id: 13, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Polo Piqué", categoria: "parte_arriba", color: "azul", temporada: "primavera", url_imagen: "/img/prenda.jpg", favorito: false },
  { id: 14, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Top Tirantes", categoria: "parte_arriba", color: "rosa", temporada: "verano", url_imagen: "/img/prenda.jpg", favorito: false },

  // --- CATEGORÍA: PARTE ABAJO (7) ---
  { id: 15, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Vaqueros Slim", categoria: "parte_abajo", color: "azul", temporada: "todo", url_imagen: "/img/prenda.jpg", favorito: true },
  { id: 16, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Pantalón Cargo", categoria: "parte_abajo", color: "verde", temporada: "otonio", url_imagen: "/img/prenda.jpg", favorito: false },
  { id: 17, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Shorts Deporte", categoria: "parte_abajo", color: "naranja", temporada: "verano", url_imagen: "/img/prenda.jpg", favorito: false },
  { id: 18, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Falda Plisada", categoria: "parte_abajo", color: "negro", temporada: "primavera", url_imagen: "/img/prenda.jpg", favorito: false },
  { id: 19, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Chándal Gris", categoria: "parte_abajo", color: "gris", temporada: "invierno", url_imagen: "/img/prenda.jpg", favorito: false },
  { id: 20, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Bermudas Chino", categoria: "parte_abajo", color: "beige", temporada: "verano", url_imagen: "/img/prenda.jpg", favorito: false },
  { id: 21, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Pantalón Pinzas", categoria: "parte_abajo", color: "morado", temporada: "otonio", url_imagen: "/img/prenda.jpg", favorito: false },

  // --- CATEGORÍA: COMPLEMENTO (7) ---
  { id: 22, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Gafas Retro", categoria: "complemento", color: "negro", temporada: "verano", url_imagen: "/img/prenda.jpg", favorito: false },
  { id: 23, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Reloj Plata", categoria: "complemento", color: "plateado", temporada: "todo", url_imagen: "/img/prenda.jpg", favorito: true },
  { id: 24, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Cinturón Piel", categoria: "complemento", color: "marron", temporada: "todo", url_imagen: "/img/prenda.jpg", favorito: false },
  { id: 25, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Bufanda Cuadros", categoria: "complemento", color: "rojo", temporada: "invierno", url_imagen: "/img/prenda.jpg", favorito: false },
  { id: 26, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Mochila Lona", categoria: "complemento", color: "amarillo", temporada: "primavera", url_imagen: "/img/prenda.jpg", favorito: false },
  { id: 27, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Pendientes Aro", categoria: "complemento", color: "dorado", temporada: "todo", url_imagen: "/img/prenda.jpg", favorito: false },
  { id: 28, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Bolso Mano", categoria: "complemento", color: "turquesa", temporada: "verano", url_imagen: "/img/prenda.jpg", favorito: false },

  // --- CATEGORÍA: CALZADO (7) ---
  { id: 29, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Sneakers White", categoria: "calzado", color: "blanco", temporada: "primavera", url_imagen: "/img/prenda.jpg", favorito: true },
  { id: 30, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Botas Militares", categoria: "calzado", color: "negro", temporada: "invierno", url_imagen: "/img/prenda.jpg", favorito: false },
  { id: 31, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Sandalias Playa", categoria: "calzado", color: "marron", temporada: "verano", url_imagen: "/img/prenda.jpg", favorito: false },
  { id: 32, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Zapatos Oxford", categoria: "calzado", color: "azul", temporada: "otonio", url_imagen: "/img/prenda.jpg", favorito: false },
  { id: 33, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Mocasines Suede", categoria: "calzado", color: "beige", temporada: "primavera", url_imagen: "/img/prenda.jpg", favorito: false },
  { id: 34, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Botines Piel", categoria: "calzado", color: "negro", temporada: "invierno", url_imagen: "/img/prenda.jpg", favorito: false },
  { id: 35, id_usuario: "4e9535ea-72b9-4dd2-8d96-e185da7c0d33", nombre: "Chanclas Goma", categoria: "calzado", color: "amarillo", temporada: "verano", url_imagen: "/img/prenda.jpg", favorito: false },
];