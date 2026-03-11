import Button from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function Modal({ isOpen, onClose, onConfirm, title, message }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-auxiliary-700/30 backdrop-blur-sm p-4">
      {/* Contenedor del modal */}
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full transform transition-all animate-in fade-in zoom-in duration-200">
        <h3 className="text-2xl font-semibold text-primary-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-8 leading-relaxed">
          {message}
        </p>
        
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={onConfirm} 
            className="bg-white hover:bg-red-600 border-red-500 text-red-600 hover:text-white"
          >
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
}