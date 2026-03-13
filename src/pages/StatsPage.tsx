import { PrendasChart } from '../components/charts/PrendasChart';
import { LoginsChart } from '../components/charts/LoginsChart';
import { CategoriasChart } from '../components/charts/CategoriasChart';
import { useTranslation } from 'react-i18next';

/**
 * Componente `StatsPage` (Panel de Dashboard).
 * * Interfaz de administración que renderiza estadísticas globales en forma de gráficos.
 * @returns {JSX.Element} Grid responsivo con los gráficos de la aplicación.
 */
export const StatsPage = () => {
    const { t } = useTranslation();

    return (
        <div className="p-6 space-y-10 transition-colors duration-300">
            {/* Cabecera de la página */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight transition-colors duration-300">{t('admin.stats_title')}</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 transition-colors duration-300">{t('admin.stats_subtitle')}</p>
            </div>

            {/* Grid de Gráficas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <PrendasChart />
                <CategoriasChart />
                <div className="lg:col-span-2">
                    <LoginsChart />
                </div>
            </div>
        </div>
    );
};