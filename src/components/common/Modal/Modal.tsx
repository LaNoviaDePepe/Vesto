import { useTranslation } from "react-i18next";
import Button from "../Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode; 
  confirmText?: string; // Añadido para que el texto de confirmación no siempre sea 'Eliminar'
  showCancel?: boolean; // Para controlar si se muestra un botón de cancelar o no
}

export default function Modal({ isOpen, onClose, onConfirm, title, message, confirmText, showCancel }: ModalProps) {
  const { t } = useTranslation();
  if (!isOpen) return null;

  // Estilo rojo del botón sólo si el texto es 'Eliminar'
  const isDanger = !confirmText || confirmText === t('actions.delete');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-auxiliary-700/30 backdrop-blur-sm p-4">
      {/* Contenedor del modal */}
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full transform transition-all animate-in fade-in zoom-in duration-200">
        <h3 className="text-2xl font-semibold mb-3 text-black">{title}</h3>
        <div className="text-gray-600 mb-8 leading-relaxed text-sm">
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
              ? "bg-white hover:bg-red-600 border-red-500 text-red-600 hover:text-white" 
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