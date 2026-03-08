import { useState} from "react";
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
import Input from "../components/common/Input.tsx";
import Footer from "../components/common/Footer.tsx";

export default function TestingPage() {

    // const prendas: PrendaProps[] = [
    //     { name: "Camiseta blanca", url: "/img/prenda.jpg", color: "blanco", temporada: "verano" },
    //     { name: "Pantalón negro", url: "/img/prenda.jpg", color: "negro", temporada: "invierno" },
    //     { name: "Camiseta blanca", url: "error", color: "blanco", temporada: "verano" }, // intentionally "error" for testing
    //     { name: "Chaqueta roja", url: "/img/prenda.jpg", color: "rojo", temporada: "otoño" },
    //     { name: "Sombrero azul", url: "/img/prenda.jpg", color: "azul", temporada: "primavera" },
    // ];
    
    // Definición del estado que se compartirá
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Función para cambiar el estado
    const toggleLogin = () => setIsLoggedIn(!isLoggedIn);

    return (
        <>
            <GuestHeader></GuestHeader>
            <UserHeader></UserHeader>
            {/* <Header isLoggedIn={isLoggedIn} onToggleLogin={toggleLogin} /> */}
            {/* --- SECCIÓN DE PRUEBAS PARA INPUTS --- */}
            <div className="max-w-4xl mx-auto p-10 flex flex-col gap-10">
                <h2 className="text-2xl font-bold border-b pb-2">Componentes de Formulario (Inputs)</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-xl shadow-sm">
                    {/* Input Básico / Default */}
                    <Input
                        label="Nombre y apellidos"
                        placeholder="Ej: Happl"
                        required
                    />

                    {/* Input con Error */}
                    <Input
                        label="Email"
                        placeholder="Text input"
                        error="Este campo es obligatorio"
                        defaultValue="error@correo"
                        required
                    />

                    {/* Input de Contraseña (con lógica de ojo) */}
                    <Input
                        label="Contraseña"
                        type="password"
                        placeholder="Introduce tu clave"
                        required
                    />

                    {/* Input Deshabilitado */}
                    <Input
                        label="Nombre de usuario (Bloqueado)"
                        placeholder="No editable"
                        disabled
                    />
                </div>
            </div>
            <div className="w-full h-full bg-auxiliary-50" >
                {/* <div className="w-96 m-20">
                    <Select name="prueba" placeholder="Elige una opción" options={["una", "dos", "tres"]} value={""} onChange={function (): void {
                        throw new Error("Function not implemented.");
                    }} />
                    <Select name="pruebaError" placeholder="Elige una opción" options={["una", "dos"]} error="hay un error" value={""} onChange={function (): void {
                        throw new Error("Function not implemented.");
                    }} />
                </div> */}
                {/* <Filter />
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
                /> */}
                {/* <Conjunto
                    name="Conjunto Casual"
                    url="/img/conjunto.png"
                    descripcion="Este conjunto combina prendas casuales perfectas para cualquier temporada. Incluye camiseta, pantalón, chaqueta y accesorios."
                    prendas={prendas}
                /> */}
            </div>
            <AddItemForm />
            <LoginForm />
            <SignUpForm />
            {/* 3. El Footer ahora recibirá el cambio en tiempo real */}
            <Footer isUser={isLoggedIn} />

        </>
    )
}