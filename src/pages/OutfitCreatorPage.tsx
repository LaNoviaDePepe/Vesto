import Filter from "../components/filter/Filter";
import PrendasLayout from "../layouts/PrendasLayout";


export default function OutfitCreatorPage() {
  return (
    <div className="grid grid-cols-2 " >
      <div className="border-r-5 border-primary-50 pr-20">
        <Filter width={50}/>
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

      <div>
        En construcción...
      </div>


    </div>




  );
}

