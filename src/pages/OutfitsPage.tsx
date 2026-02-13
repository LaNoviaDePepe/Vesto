import Conjunto from "../components/clothing/Conjunto";
import type { PrendaProps } from "../components/clothing/Prenda";


export default function OutfitsPage() {

  const prendas: PrendaProps[] = [
    { name: "Camiseta blanca", url: "/img/prenda.jpg", color: "blanco", temporada: "verano" },
    { name: "Pantalón negro", url: "/img/prenda.jpg", color: "negro", temporada: "invierno" },
    { name: "Camiseta blanca", url: "error", color: "blanco", temporada: "verano" }, // intentionally "error" for testing
    { name: "Chaqueta roja", url: "/img/prenda.jpg", color: "rojo", temporada: "otoño" },
    { name: "Sombrero azul", url: "/img/prenda.jpg", color: "azul", temporada: "primavera" },
  ];

  return (
    <div className="flex flex-col gap-10 p-10">
      <Conjunto
        name="Conjunto Casual"
        url="/img/conjunto.png"
        descripcion="Este conjunto combina prendas casuales perfectas para cualquier temporada. Incluye camiseta, pantalón, chaqueta y accesorios."
        prendas={prendas}
      />
      <Conjunto
        name="Conjunto Normal"
        url="/img/conjunto.png"
        descripcion="Este conjunto combina prendas casuales perfectas para cualquier temporada. Incluye camiseta, pantalón, chaqueta y accesorios."
        prendas={prendas}
      />
      <Conjunto
        name="Conjunto Sexy"
        url="/img/conjunto.png"
        descripcion="Este conjunto combina prendas casuales perfectas para cualquier temporada. Incluye camiseta, pantalón, chaqueta y accesorios."
        prendas={prendas}
      />
    </div>

  )
}
