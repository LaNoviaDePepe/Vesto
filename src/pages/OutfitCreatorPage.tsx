import Filter from "../components/filter/Filter";
import PrendasLayout from "../layouts/PrendasLayout";


export default function OutfitCreatorPage() {
  return (
    <div className="grid grid-cols-2 gap-6" >
      {/* Left column */}
      <div>
        <Filter />
        <PrendasLayout
          prendas={[
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
          ]}
        />
      </div>

      {/* Right column */}
      <div>
        En construcción...
      </div>


    </div>




  );
}

