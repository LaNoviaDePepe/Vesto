import { useTranslation } from "react-i18next";
import Button from "../Button"; // Ajusta la ruta si es necesario

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode; 
  confirmText?: string;
  showCancel?: boolean;
}

export default function Modal({ isOpen, onClose, onConfirm, title, message, confirmText, showCancel = true }: ModalProps) {
  const { t } = useTranslation();
  if (!isOpen) return null;

  // Estilo rojo del botón sólo si el texto es 'Eliminar'
  const isDanger = !confirmText || confirmText === t('actions.delete');

  return (
    // Velo trasero más oscuro en modo dark
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-auxiliary-700/30 dark:bg-black/70 backdrop-blur-sm p-4 transition-colors duration-300">
      
      {/* Contenedor de la tarjeta del modal */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl max-w-sm w-full transform transition-all animate-in fade-in zoom-in duration-200">
        <h3 className="text-2xl font-semibold mb-3 text-black dark:text-white transition-colors duration-300">{title}</h3>
        <div className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-sm transition-colors duration-300">
          {message}
        </div>

        <div className="flex justify-end gap-3">
          {showCancel && (
            <Button variant="secondary" onClick={onClose}>
              {t('actions.cancel')}
            </Button>
          )}
          <Button
            onClick={onConfirm}
            className={isDanger 
              ? "bg-white dark:bg-transparent hover:bg-red-600 dark:hover:bg-red-600 border-red-500 text-red-600 hover:text-white transition-colors duration-300" 
              : "btn-primary"
            }
          >
            {confirmText || t('actions.delete')}
          </Button>
        </div>
      </div>
    </div>
  );
}