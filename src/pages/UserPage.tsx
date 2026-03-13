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
            } else if (data) { setUsers(data); }
            setLoading(false);
        };
        fetchUsers();
    }, []);

    const handleUpdateConfirm = async (data: { nombre_apellidos: string }) => {
        const { error } = await userRepository.updateUser(selectedUser.id, data);
        if (error) {
            toast.error(t('admin.user_updated_error', { error: error.message }));
        } else {
            toast.success(t('admin.user_updated_success'));
            setUsers(users.map(u => u.id === selectedUser.id ? { ...u, nombre_apellidos: data.nombre_apellidos } : u));
            setIsEditModalOpen(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!selectedUser) return;
        const { error } = await userRepository.deleteUser(selectedUser.id);
        if (error) {
            toast.error(t('admin.user_deleted_error', { error: error.message }));
        } else {
            toast.success(t('admin.user_deleted_success'));
            setUsers(users.filter(u => u.id !== selectedUser.id));
            setIsDeleteModalOpen(false);
        }
    };

    if (loading) return <p className="p-6 dark:text-white transition-colors duration-300">{t('admin.users_loading')}</p>;
    if (error) return <p className="p-6 dark:text-white transition-colors duration-300">{error}</p>;

    return (
        <div className="p-6 transition-colors duration-300">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white transition-colors duration-300">
                {t('admin.users_title')}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 rounded-lg shadow dark:shadow-none flex items-center gap-3 transition-colors duration-300"
                    >
                        <div className="flex-shrink-0">
                            {user.url_avatar ? (
                                <img src={user.url_avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center transition-colors duration-300">👤</div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300 truncate" title={user.nombre_apellidos}>
                                {user.nombre_apellidos}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300 truncate">
                                {t('admin.role')}{user.user_roles?.[0]?.role ?? t('admin.default_role')}
                            </p>
                        </div>

                        <div className="flex flex-col gap-1 ml-auto">
                            <button
                                onClick={() => { setSelectedUser(user); setIsEditModalOpen(true); }}
                                className="w-8 h-8 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded-full transition-all duration-200 hover:scale-110"
                                title="Modificar"
                            >
                                <Settings size={18} />
                            </button>
                            <button
                                onClick={() => { setSelectedUser(user); setIsDeleteModalOpen(true); }}
                                className="w-8 h-8 flex items-center justify-center text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-full transition-all duration-200 hover:scale-110"
                                title="Eliminar"
                            >
                                <XCircle size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDeleteConfirm} title="Eliminar Usuario" message={`¿Estás seguro de que deseas eliminar a ${selectedUser?.nombre_apellidos}?`} />
            <ModalModificar isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onConfirm={handleUpdateConfirm} user={selectedUser} />

            {users.length === 0 && <p className="dark:text-white mt-4">No hay usuarios registrados.</p>}
        </div>
    );
};