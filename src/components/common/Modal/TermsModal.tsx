import Modal from "./Modal";
import { useTranslation } from "react-i18next";

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    showCancel: boolean;
}

export default function TermsModal({ isOpen, onClose, onConfirm, showCancel }: TermsModalProps) {
    const { t } = useTranslation();

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            showCancel={showCancel}
            title={t('terms.title')}
            confirmText={t('terms.accept')}
            message={
                <div className="flex flex-col gap-4">
                    <p className="font-semibold text-primary-900 dark:text-white transition-colors duration-300">{t('terms.intro')}</p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 transition-colors duration-300">
                        <li>{t('terms.point_1')}</li>
                        <li>{t('terms.point_2')}</li>
                        <li>{t('terms.point_3')}</li>
                        <li>{t('terms.point_4')}</li>
                    </ul>
                </div>
            }
        />
    )
}