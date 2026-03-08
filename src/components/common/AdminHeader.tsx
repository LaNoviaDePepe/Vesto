import { useNavigate } from 'react-router-dom';
import { Users, LayoutDashboard } from 'lucide-react';
import UserHeader from './UserHeader';
import Button from './Button';

export default function AdminHeader() {
    const navigate = useNavigate();

    return (
        <UserHeader>
            {/* Botón 1: Gestión de Usuarios */}
            <Button 
                variant="icon" 
                onClick={() => navigate('/admin/users')} 
                className="min-w-15 min-h-15"
                title="Gestión de Usuarios"
            >
                <Users size={25} strokeWidth={2.5} />
            </Button>
            
            {/* Botón 2: Panel de Control */}
            <Button 
                variant="icon" 
                onClick={() => navigate('/admin/dashboard')} 
                className="min-w-15 min-h-15"
                title="Panel de Control"
            >
                <LayoutDashboard size={25} strokeWidth={2.5} />
            </Button>
        </UserHeader>
    );
}