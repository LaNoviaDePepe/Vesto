import type { ChangeEvent } from "react";
import Conjunto from "../components/clothing/Conjunto.tsx";
import { type PrendaProps } from "../components/clothing/Prenda.tsx";
import GuestHeader from "../components/common/GuestHeader.tsx";
import Header from "../components/common/Header.tsx";
import Select from "../components/common/Select.tsx";
import UserHeader from "../components/common/UserHeader.tsx";
import Filter from "../components/filter/Filter.tsx";
import PrendasLayout from "../layouts/PrendasLayout.tsx";
import AddItemForm from "../components/forms/AddItemForm.tsx";
import LoginForm from "../components/forms/LoginForm.tsx";
import SignUpForm from "../components/forms/SignUpForm .tsx";

export default function TestingPage() {

    const prendas: PrendaProps[] = [
        { name: "Camiseta blanca", url: "/img/prenda.jpg", color: "blanco", temporada: "verano" },
        { name: "Pantalón negro", url: "/img/prenda.jpg", color: "negro", temporada: "invierno" },
        { name: "Camiseta blanca", url: "error", color: "blanco", temporada: "verano" }, // intentionally "error" for testing
        { name: "Chaqueta roja", url: "/img/prenda.jpg", color: "rojo", temporada: "otoño" },
        { name: "Sombrero azul", url: "/img/prenda.jpg", color: "azul", temporada: "primavera" },
    ];

    return (
        <>
            <GuestHeader></GuestHeader>
            <UserHeader></UserHeader>
            <Header />
            <div className="w-full h-full bg-auxiliary-50" >
                <div className="w-96 m-20">
                    <Select name="prueba" placeholder="Elige una opción" options={["una", "dos", "tres"]} value={""} onChange={function (e: ChangeEvent<HTMLSelectElement>): void {
                        throw new Error("Function not implemented.");
                    }} />
                    <Select name="pruebaError" placeholder="Elige una opción" options={["una", "dos"]} error="hay un error" value={""} onChange={function (e: ChangeEvent<HTMLSelectElement>): void {
                        throw new Error("Function not implemented.");
                    }} />
                </div>
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
                    ]}
                />
                <Conjunto
                    name="Conjunto Casual"
                    url="/img/conjunto.png"
                    descripcion="Este conjunto combina prendas casuales perfectas para cualquier temporada. Incluye camiseta, pantalón, chaqueta y accesorios."
                    prendas={prendas}
                />
            </div>
            <AddItemForm />
            <LoginForm />
            <SignUpForm />
        </>
    )
}