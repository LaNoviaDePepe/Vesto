import FilterSelect from "./FilterSelect";

export default function Filter() {
    return (
        <div className="w-full bg-[var(--color-primary-50)] flex justify-evenly items-center py-4">
            <FilterSelect name="filtro" placeholder="Elige un filtro" options={["una", "dos", "tres"]} />
            <FilterSelect name="filtro" placeholder="Elige un filtro" options={["una", "dos", "tres"]} />
            <FilterSelect name="filtro" placeholder="Elige un filtro" options={["una", "dos", "tres"]} />
        </div>
    )
}