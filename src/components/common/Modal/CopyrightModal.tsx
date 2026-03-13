import Modal from "./Modal";
import { useTranslation } from "react-i18next";

interface CopyrightModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    showCancel?: boolean;
}

export default function CopyrightModal({ isOpen, onClose, onConfirm, showCancel = true }: CopyrightModalProps) {
    const { t } = useTranslation();

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            showCancel={showCancel}
            title={t('copyright.title')}
            confirmText={t('terms.accept')} // Reutilizamos "Entendido"
            message={
                /* */
                <div className="flex flex-col gap-4">
                    <p className="font-semibold text-primary-900">{t('copyright.intro')}</p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                        <li>{t('copyright.point_1')}</li>
                        <li>{t('copyright.point_2')}</li>
                        <li>{t('copyright.point_3')}</li>
                        <li>{t('copyright.point_4')}</li>
                    </ul>
                </div>
            }
        />
    );
}