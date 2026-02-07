import SelectForm from "../components/common/Select.tsx";
import Filter from "../components/filter/Filter.tsx";

export default function TestingPage() {

    return (
        <>
        <div className="w-96 m-20">
            <SelectForm name="prueba" placeholder="Elige una opción" options={["una", "dos", "tres"]}/>
            <SelectForm name="pruebaError" placeholder="Elige una opción" options={["una", "dos"]} error="hay un error"/>
        </div>
        <Filter />
        </>
    )
}