import FilterSelect from "./FilterSelect";

export default function Filter() {
    return (
        <div className="w-full bg-primary-50 flex justify-evenly items-center py-4 fixed top-0 z-50 mt-20">
            <FilterSelect name="filtro" placeholder="Elige un tipo" options={["gorro", "camiseta", "pantalón", "complemento", "calzado"]} />
            <FilterSelect name="filtro" placeholder="Elige un color" options={["negro", "blanco", "rojo", "azul", "verde", "marrón", "amarillo", "gris", "morado"]} />
            <FilterSelect name="filtro" placeholder="Elige una temporada" options={["primavera", "verano", "otoño", "invierno"]} />
        </div>
    )
}