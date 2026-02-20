import { useState } from "react";
import { supabase } from "../database/supabase/Client";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);
        
        // Supabase detecta el token de recuperación en la URL automáticamente
        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            toast.error("Error al actualizar: " + error.message);
            setLoading(false);
        } else {
            toast.success("¡Contraseña actualizada con éxito!");
            // Redirección al login
            navigate("/login");
        }
    };

    return (
        <div className="py-10 px-6 max-w-md mx-auto bg-white border-2 border-auxiliary-700 rounded-2xl shadow-xl mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center text-black">Nueva Contraseña</h2>
            
            <form onSubmit={handleUpdate} className="space-y-6">
                <Input 
                    label="Escribe tu nueva clave"
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Input 
                    label="Confirma tu nueva clave"
                    type="password" 
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-full"
                    disabled={loading || !password || !confirmPassword}
                >
                    {loading ? "Cambiando..." : "Actualizar contraseña"}
                </Button>
            </form>
        </div>
    );
}