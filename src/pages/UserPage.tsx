import { useEffect, useState } from 'react';
import { createUserRepository } from '../database/repositories';
import toast from 'react-hot-toast';

export const UsersPage = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            const userRepository = createUserRepository();
            const { data, error } = await userRepository.getAllUsers();

            if (error) {
                toast.error('Vaya, no hemos podido cargar la lista de usuarios. Inténtalo de nuevo más tarde.');
                setError('No se pudo cargar la información de los usuarios.');
            } else if (data) {
                setUsers(data);
            }
            setLoading(false);
        };

        fetchUsers();
    }, []);

    if (loading) return <p>Cargando usuarios...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Lista de Usuarios</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((user) => (
                    <div key={user.id} className="border p-4 rounded-lg shadow flex items-center gap-4">
                        {/* Mostramos el avatar o un div vacío si no tiene */}
                        {user.url_avatar ? (
                            <img src={user.url_avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                👤
                            </div>
                        )}
                        <div>
                            <p className="font-semibold">{user.nombre_apellidos}</p>
                            <p className="text-sm text-gray-500">Rol: {user.rol}</p>
                        </div>
                    </div>
                ))}
            </div>

            {users.length === 0 && <p>No hay usuarios registrados.</p>}
        </div>
    );
};