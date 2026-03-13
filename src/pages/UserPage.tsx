import { useEffect, useState } from 'react';
import { createUserRepository } from '../database/repositories';
import toast from 'react-hot-toast';
import { Settings, XCircle } from 'lucide-react';
import Modal from '../components/common/Modal/Modal';
import ModalModificar from '../components/common/Modal/ModalModificar';
import { useTranslation } from 'react-i18next';

export const UserPage = () => {
    const { t } = useTranslation();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estados para los modales
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const userRepository = createUserRepository();
    useEffect(() => {
        const fetchUsers = async () => {
            const { data, error } = await userRepository.getAllUsers();


            if (error) {
                toast.error(t('admin.users_error_toast'));
                setError(t('admin.users_error_msg'));
            } else if (data) {
                setUsers(data);
            }
            setLoading(false);
        };


        fetchUsers();
    }, []);


    // Función para confirmar la ACTUALIZACIÓN
    const handleUpdateConfirm = async (data: { nombre_apellidos: string }) => {
        const { error } = await userRepository.updateUser(selectedUser.id, data);

        if (error) {
            toast.error('Error al actualizar: ' + error.message);
        } else {
            toast.success('Nombre actualizado');
            setUsers(users.map(u => u.id === selectedUser.id ? { ...u, nombre_apellidos: data.nombre_apellidos } : u));
            setIsEditModalOpen(false);
        }
    };

    // Función para confirmar la ELIMINACIÓN
    const handleDeleteConfirm = async () => {
        if (!selectedUser) return;

        const { error } = await userRepository.deleteUser(selectedUser.id);

        if (error) {
            toast.error('No se pudo eliminar el perfil: ' + error.message);
        } else {
            toast.success('Perfil eliminado correctamente');
            // Actualizamos la lista local eliminando al usuario
            setUsers(users.filter(u => u.id !== selectedUser.id));
            setIsDeleteModalOpen(false);
        }
    };

    if (loading) return <p>{t('admin.users_loading')}</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">{t('admin.users_title')}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((user) => (
                    <div key={user.id} className="border p-4 rounded-lg shadow flex items-center gap-4">
                        {/* Mostramos el avatar o un div vacío si no tiene */}
                        {user.url_avatar ? (
                            <img src={user.url_avatar} alt="t('admin.avatar_alt')}" className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                👤
                            </div>
                        )}
                        <div>
                            <p className="font-semibold">{user.nombre_apellidos}</p>
                            <p className="text-sm text-gray-500">{t('admin.role')}{user.user_roles?.[0]?.role ?? t('admin.default_role')}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setSelectedUser(user);
                                    setIsEditModalOpen(true);
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                                title="Modificar"
                            >
                                <Settings size={20} />
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedUser(user);
                                    setIsDeleteModalOpen(true);
                                }}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                                title="Eliminar"
                            >
                                <XCircle size={20} />
                            </button>
                        </div>
                    </div>

                ))}
            </div>
            {/* Modal Genérico para Eliminar */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Eliminar Usuario"
                message={`¿Estás seguro de que deseas eliminar a ${selectedUser?.nombre_apellidos}? Esta acción borrará permanentemente su cuenta y todos sus datos.`}
            />

            {/* Nuevo Modal específico para Modificar */}
            <ModalModificar
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onConfirm={handleUpdateConfirm}
                user={selectedUser}
            />
            {users.length === 0 && <p>No hay usuarios registrados.</p>}
        </div >
    );
};