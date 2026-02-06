import SelectForm from "../components/filter/SelectForm.tsx";

export default function TestingPage() {

    return (
        <>
            <SelectForm name="prueba" placeholder="Elige una opción" options={["una", "dos", "tres"]} error="Hay un error" />
        </>
    )
}