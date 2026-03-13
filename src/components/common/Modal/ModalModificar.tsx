import { useState, useEffect } from "react";
import Button from "../Button";

interface ModalModificarProps { isOpen: boolean; onClose: () => void; onConfirm: (data: { nombre_apellidos: string; password?: string }) => void; user: any; }

export default function ModalModificar({ isOpen, onClose, onConfirm, user }: ModalModificarProps) {
  const [nombre, setNombre] = useState("");

  useEffect(() => { if (user && isOpen) setNombre(user.nombre_apellidos || ""); }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onConfirm({ nombre_apellidos: nombre }); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-auxiliary-700/30 dark:bg-black/70 backdrop-blur-sm p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-2xl max-w-md w-full transition-colors duration-300">
        <h3 className="text-2xl font-semibold text-primary-900 dark:text-white mb-6 transition-colors duration-300">Modificar Nombre</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">Nombre y Apellidos</label>
            <input
              type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required
              className="w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
            />
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <Button variant="secondary" onClick={onClose} type="button">Cancelar</Button>
            <Button type="submit">Guardar Cambios</Button>
          </div>
        </form>
      </div>
    </div>
  );
}