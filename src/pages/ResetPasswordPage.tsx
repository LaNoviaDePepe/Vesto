import { useState } from "react";
import { supabase } from "../database/supabase/Client";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useTranslation } from "react-i18next";

/**
 * Componente `ResetPasswordPage`.
 * * Gestiona la asignación de una nueva contraseña para el usuario
 * una vez que ha accedido a la URL segura proporcionada por Supabase en su correo.
 * @returns {JSX.Element} Formulario flotante para la nueva contraseña.
 */
export default function ResetPasswordPage() {
    const { t } = useTranslation();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) { toast.error(t('reset_password.passwords_mismatch')); return; }
        
        setLoading(true);
        // Supabase detecta el token de recuperación en la URL automáticamente
        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            toast.error(t('reset_password.update_error') + error.message);
            setLoading(false);
        } else {
            toast.success(t('reset_password.update_success'));
            navigate("/login");
        }
    };

    return (
        <div className="py-10 px-6 max-w-md mx-auto bg-white dark:bg-gray-900 border-2 border-auxiliary-700 dark:border-gray-700 rounded-2xl shadow-xl dark:shadow-none mt-10 transition-colors duration-300">
            <h2 className="text-2xl font-bold mb-6 text-center text-black dark:text-white transition-colors duration-300">Nueva Contraseña</h2>

            <form onSubmit={handleUpdate} className="space-y-6">
                <Input label={t('reset_password.new_password_label')} type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                <Input label={t('reset_password.confirm_password_label')} type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <Button type="submit" variant="primary" className="w-full" disabled={loading || !password || !confirmPassword}>
                    {loading ? t('reset_password.changing') : t('reset_password.update_btn')}
                </Button>
            </form>
        </div>
    );
}