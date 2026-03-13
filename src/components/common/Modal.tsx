import { useTranslation } from "react-i18next";
import Button from "./Button";

interface ModalProps { isOpen: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string; }

export default function Modal({ isOpen, onClose, onConfirm, title, message }: ModalProps) {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    // Backdrop más oscuro (dark:bg-black/60)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-auxiliary-700/30 dark:bg-black/70 backdrop-blur-sm p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-2xl max-w-sm w-full transform transition-all animate-in fade-in zoom-in duration-200">
        <h3 className="text-2xl font-semibold text-primary-900 dark:text-white mb-3 transition-colors duration-300">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed transition-colors duration-300">
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            {t('actions.cancel')}
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-white dark:bg-transparent hover:bg-red-600 dark:hover:bg-red-600 border-red-500 text-red-600 hover:text-white transition-colors duration-300"
          >
            {t('actions.delete')}
          </Button>
        </div>
      </div>
    </div>
  );
}