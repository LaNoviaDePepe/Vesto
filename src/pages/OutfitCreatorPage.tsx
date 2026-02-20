import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Filter from "../components/filter/Filter";
import Prenda from "../components/clothing/Prenda";
import Button from "../components/common/Button";
import { SupabaseOutfitRepository } from "../database/supabase/SupabaseOutfitRepository";
import { CircleChevronUp } from "lucide-react";
import Input from "../components/common/Input";
import { SupabaseItemRepository } from "../database/supabase/SupabaseItemRepository";
import { useAuthStore } from "../stores/authStore";
import { useFilterStore } from "../stores/filterStore";

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

// Interfaz para los errores siguiendo tu ejemplo
interface ErrorsProps {
  nombre: string;
  outfit: string;
  imagen: string;
}

const outfitRepo = new SupabaseOutfitRepository();
const itemRepository = new SupabaseItemRepository();

export default function OutfitCreatorPage() {

  const { sessionUser } = useAuthStore();
  const { setFilter, resetFilters } = useFilterStore();

  const [prendas, setPrendas] = useState<PrendaBD[]>([]); // Lista de la izquierda
  const [loading, setLoading] = useState(false);
  const [nombreConjunto, setNombreConjunto] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // ESATADO DEL OUTFIT (Derecha)
  const [outfit, setOutfit] = useState<Record<CategoriaPrenda, PrendaBD | null>>({
    cabeza: null,
    parte_arriba: null,
    parte_abajo: null,
    complemento: null,
    calzado: null,
  });

  const [imagenConjunto, setImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [errors, setErrors] = useState<ErrorsProps>({
    nombre: "",
    outfit: "",
    imagen: ""
  });

  const handleSelectPrenda = (prenda: PrendaBD) => {
    setOutfit((estadoprevio) => {
      // Si la prenda ya está seleccionada en su categoría, la quitamos
      const isAlreadySelected = estadoprevio[prenda.categoria]?.id === prenda.id;
      return {
        ...estadoprevio,
        [prenda.categoria]: isAlreadySelected ? null : prenda,
      };
    });
    setErrors(prev => ({ ...prev, outfit: "" }));
  };

  /**
   * Lógica de guardado conectada a Supabase
   */
  const handleSaveOutfit = async (e: React.SubmitEvent) => {
    e.preventDefault(); // Manejo de form

    const prendasSeleccionadas = Object.values(outfit).filter((p): p is PrendaBD => p !== null);

    // 1. Validaciones previas siguiendo tu estructura
    const newErrors = {
      nombre: !nombreConjunto.trim() ? "Por favor, introduce un nombre para el conjunto." : "",
      outfit: prendasSeleccionadas.length === 0 ? "Debes seleccionar al menos una prenda." : "",
      imagen: ""
    };

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some(err => err !== "");

    if (!hasErrors) {
      setLoading(true);

      // 2. Llamada al repositorio
      const { error } = await outfitRepo.createConjunto({
        nombre: nombreConjunto,
        descripcion: descripcion,
        id_usuario: userId,
        prendasIds: prendasSeleccionadas.map(p => typeof p.id === 'number' ? p.id : parseInt(p.id as string, 10)).filter(id => !isNaN(id)),
        favorito: false,
        imagen: imagenConjunto
      });

      setLoading(false);

      if (error) {
        alert("Hubo un error al guardar el conjunto.");
      } else {
        alert(`¡Conjunto '${nombreConjunto}' guardado con éxito!`);

        setNombreConjunto("");
        setDescripcion("");
        setPreview(null);
        setImagen(null);
        setOutfit({
          cabeza: null,
          parte_arriba: null,
          parte_abajo: null,
          complemento: null,
          calzado: null,
        });
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagen(file);
      setPreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, imagen: "" }));
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
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50" id="closet-container">
          {errors.outfit && <p className="text-center text-red-500 mb-4 font-bold">{errors.outfit}</p>}
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
            <Button
              variant="out"
              className="border-0 hover:bg-transparent hover:shadow-none"
              onClick={scrollToTopArmario}
            >
              <CircleChevronUp size={28} strokeWidth={2.25} className="text-white bg-auxiliary-700 rounded-full hover:bg-primary-700" />
            </Button>
          </div>
        </div>
      </div>

      {/* COLUMNA DERECHA: CREADOR */}
      <form onSubmit={handleSaveOutfit} className="w-full lg:w-125 xl:w-150 bg-auxiliary-50 flex flex-col p-8 h-svh overflow-y-auto">
        <div className="flex flex-col gap-4 mb-10">
          {/* Fila del Nombre y Botón */}
          <div className="flex gap-3 ">
            <Input
              placeholder="Nombre del conjunto"
              value={nombreConjunto}
              disabled={loading}
              onChange={(e) => {
                setNombreConjunto(e.target.value);
                setErrors(prev => ({ ...prev, nombre: "" }));
              }}
              error={errors.nombre}
            />
            <Button variant="primary" type="submit" disabled={loading}
              className="min-w-30 self-center">
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </div>

          {/* Textarea para la descripción */}
          <div className="flex flex-col gap-2 w-full">
            <textarea
              placeholder="Descripción del conjunto, ocasión, etc..."
              value={descripcion}
              disabled={loading}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={2}
              className="w-full rounded-md text-sm border border-gray-300 px-4 py-3 outline-none  bg-white transition-all font-body focus:border-auxiliary-700 focus:ring-1 focus:ring-auxiliary-700 placeholder:text-gray-300 shadow-sm resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>
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

        <div className="flex flex-col items-center justify-center space-y-6 mt-10 pb-10 mb-10">
          {/* Input File */}
          <div className="w-full max-w-75">
            <input
              type="file"
              name="imagen"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer border rounded-md"
            />
            {errors.imagen && <p className="mt-2 text-sm text-danger-600 font-medium">{errors.imagen}</p>}
          </div>
          <div className="w-full aspect-square max-w-80 rounded-2xl overflow-auto border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center relative">
            {preview ? (
              <img src={preview} alt="Vista previa" className="w-50 h-50 object-cover" />
            ) : (
              <div className="text-center p-6">
                {/* Icono de "No image available" con gradiente naranja */}
                <div className="w-20 h-20 mx-auto mb-4 bg-linear-to-br from-auxiliary-300 to-auxiliary-700 rounded-lg flex items-center justify-center text-white opacity-50">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-400 font-medium">No Image Available</p>
              </div>
            )}
          </div>

          
        </div>
      </form>
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
      <div className={`w-28 h-36 bg-white border-2 rounded-2xl flex items-center justify-center p-2 shadow-sm transition-all ${item ? 'border-primary-700 shadow-md' : 'border-dashed border-gray-300'
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