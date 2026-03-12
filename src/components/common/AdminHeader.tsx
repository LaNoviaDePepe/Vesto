import { useNavigate } from 'react-router-dom';
import { Users, LayoutDashboard } from 'lucide-react'; // Importación normal
import { motion } from 'framer-motion'; // Importación de motion
import UserHeader from './UserHeader';
import Button from './Button';
import { useTranslation } from 'react-i18next';

// Creamos versiones animadas de los iconos de Lucide
const MotionUsers = motion(Users);
const MotionDashboard = motion(LayoutDashboard);

export default function AdminHeader() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Variantes para la animación de los iconos
    const iconVariants = {
        initial: { scale: 1, x: 0 },
        animate: { 
            scale: 1.1, 
            x: [0, 2, -2, 0], // Pequeño "shaking" o movimiento lateral
            transition: { duration: 0.3 } 
        }
    };

    return (
        <UserHeader>
            {/* Botón 1: Gestión de Usuarios */}
            <Button
                variant="icon"
                onClick={() => navigate('/admin/users')}
                className="min-w-15 min-h-15"
                title={t('admin.user_management_title')}
            >
                <MotionUsers 
                    size={25} 
                    strokeWidth={2.5}
                    variants={iconVariants}
                    whileHover="animate" // Se anima cuando el ratón entra al botón
                />
            </Button>

            {/* Botón 2: Panel de Control */}
            <Button
                variant="icon"
                onClick={() => navigate('/admin/dashboard')}
                className="min-w-15 min-h-15"
                title={t('admin.dashboard_title')}
            >
                <MotionDashboard 
                    size={25} 
                    strokeWidth={2.5}
                    variants={{
                        initial: { rotate: 0 },
                        animate: { rotate: 15, scale: 1.1 }
                    }}
                    whileHover="animate"
                />
            </Button>
        </UserHeader>
    );
}