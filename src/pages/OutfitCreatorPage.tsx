import { useEffect, useState, type ChangeEvent } from "react";
import Filter, { type FilterState } from "../components/filter/Filter";
import Prenda, { type PrendaProps } from "../components/clothing/Prenda";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { OutfitSlot } from "../components/clothing/OutfitSlot";
import { SupabaseOutfitRepository } from "../database/supabase/SupabaseOutfitRepository";
import { SupabaseItemRepository } from "../database/supabase/SupabaseItemRepository";
import { CircleChevronUp } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import toast from "react-hot-toast";


interface ErrorsProps {
  nombre: string;
  outfit: string;
  imagen: string;
}

const outfitRepo = new SupabaseOutfitRepository();
const itemRepository = new SupabaseItemRepository();


export default function OutfitCreatorPage() {

  const { sessionUser } = useAuthStore();

  //Estado de prendas
  const [prendas, setPrendas] = useState<PrendaProps[]>([]);

  //Estado inicial de los filtros
  const [filters, setFilters] = useState<FilterState>({
    categoria: "",
    temporada: "",
    color: "",
    favorito: false,
  });

  // Campos del form (derecha)
  const [nombreConjunto, setNombreConjunto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagenConjunto, setImagen] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  // Estado del outfit
  const [outfit, setOutfit] = useState<Record<string, PrendaProps | null>>({
    cabeza: null,
    parte_arriba: null,
    parte_abajo: null,
    complemento: null,
    calzado: null,
  });

  const [errors, setErrors] = useState<ErrorsProps>({
    nombre: "",
    outfit: "",
    imagen: ""
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

      const prendasAdaptadas: PrendaProps[] = (data || []).map((p: any) => ({
        id: p.id,
        id_usuario: sessionUser.user.id,
        name: p.nombre,
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


  // LÓGICA DE FILTRADO 

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ categoria: "", temporada: "", color: "", favorito: false });
  };

  const prendasFiltradas = prendas.filter((prenda) => {
    if (filters.categoria && prenda.categoria !== filters.categoria) return false;
    if (filters.temporada && prenda.temporada !== filters.temporada) return false;
    if (filters.color && prenda.color !== filters.color) return false;
    if (filters.favorito && !prenda.favorito) return false;
    return true;
  });


  // LÓGICA DE SELECCIÓN Y GUARDADO 
  const handleSelectPrenda = (prenda: PrendaProps) => {
    setOutfit((estadoprevio) => {
      // Si la prenda ya está seleccionada en su categoría, la quitamos
      const isAlreadySelected = estadoprevio[prenda.categoria]?.id === prenda.id;
      return {
        ...estadoprevio,
        [prenda.categoria]: isAlreadySelected ? null : prenda,
      };
    });
    setErrors(estadoPrevio => ({ ...estadoPrevio, outfit: "" }));
  };


  // LÓGICA DE GUARDADO CONECTADA A SUPABASE
  const handleSaveOutfit = async (e: React.SubmitEvent) => {
    e.preventDefault(); // Manejo de form

    const prendasSeleccionadas = Object.values(outfit).filter((p): p is PrendaProps => p !== null);

    // Validaciones previas 
    const newErrors = {
      nombre: !nombreConjunto.trim() ? "Por favor, introduce un nombre para el conjunto." : "",
      outfit: prendasSeleccionadas.length === 0 ? "Debes seleccionar al menos una prenda." : "",
      imagen: ""
    };

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some(err => err !== "");

    if (!hasErrors) {
      setLoading(true);

      // Sólo llamamos al repositorio si existe un usuario logueado, lo cual garantiza que user.id no sea posiblemente null.
      if (sessionUser) {
        const { error } = await outfitRepo.createConjunto({
          nombre: nombreConjunto,
          descripcion: descripcion,
          id_usuario: sessionUser.user.id,
          favorito: false,
          url_imagen: imagenConjunto ?? undefined,

          // Como en PrendasProps el id es opcional (ya que si estamos creando una nueva prenda, 
          // aún no tiene id), filtramos las que sí tienen ID y lo convertimos a number (que es lo que pide la BD)
          prendasIds: prendasSeleccionadas
            .filter(p => p.id !== undefined)
            .map(p => Number(p.id)),
        });

        setLoading(false);

        if (error) {
          toast.error("Hubo un error al guardar el conjunto.");
        } else {
          toast.success(`¡Conjunto '${nombreConjunto}' guardado con éxito!`);

          // Reseteo de form
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
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagen(file);
      setPreview(URL.createObjectURL(file));
      setErrors(estadoPrevio => ({ ...estadoPrevio, imagen: "" }));
    }
  };

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

  // Controla la función de subida en el div de prendas
  const scrollToTopArmario = () => {
    const element = document.getElementById("closet-container");
    element?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };


  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden bg-primary-300 ">

      {/* COLUMNA IZQUIERDA: ARMARIO */}
      {/* Este div queda en posición 'relative' para colocar el botón de volver arriba respecto al conjunto de prendas. */}
      <div className="relative flex-1 flex flex-col overflow-hidden border-r border-gray-100">

        {/* Barra de Filtros */}
        <Filter width={100} filters={filters} onFilterChange={handleFilterChange} />
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50" id="closet-container">
          {errors.outfit && <p className="text-center text-red-500 mb-4 font-bold">{errors.outfit}</p>}
          <div className="flex flex-wrap gap-6 justify-center">

            {/* Mapeo de Prendas FILTRADAS */}
            {prendasFiltradas.length > 0 ? (
              prendasFiltradas.map((prenda) => (
                <div
                  key={prenda.id}
                  onClick={() => handleSelectPrenda(prenda)}
                  className={`cursor-pointer transition-all duration-200 rounded-xl ${outfit[prenda.categoria]?.id === prenda.id
                    ? 'ring-4 ring-primary-700 shadow-lg scale-105'
                    : 'hover:opacity-80'
                    }`}
                >
                  <Prenda {...prenda} onToggleFavorito={handleToggleFavorito}/>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400 w-full">
                <p className="text-lg">No se encontraron prendas con estos filtros</p>
                <button onClick={handleResetFilters} className="text-primary-600 underline mt-4 hover:text-primary-800 transition-colors cursor-pointer">
                  Limpiar filtros
                </button>
              </div>
            )}

          </div>

          {/* Botón flotante para subir */}
          <div className="absolute bottom-6 right-6 z-20">
            <Button
              variant="icon"
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
              
        <div className="flex flex-col items-center justify-center space-y-6 mt-10 pb-20 mb-10">
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
                <p className="text-gray-400 font-medium">Sube foto de tu outfit</p>
              </div>
            )}
          </div>

        </div>
      </form>
    </div>
  );
}
