import { PrendasChart } from '../components/charts/PrendasChart';
import { LoginsChart } from '../components/charts/LoginsChart';
import { CategoriasChart } from '../components/charts/CategoriasChart';
import { useTranslation } from 'react-i18next';

export const StatsPage = () => {
    const { t } = useTranslation();

    return (
        <div className="p-6 space-y-10">
            {/* Cabecera de la página */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800 tracking-tight">{t('admin.stats_title')}</h1>
                <p className="text-gray-500 mt-2">{t('admin.stats_subtitle')}</p>
            </div>

            {/* Grid de Gráficas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Primera fila: 2 columnas */}
                <PrendasChart />
                <CategoriasChart />

                {/* Segunda fila: Ocupa todo el ancho (lg:col-span-2) */}
                <div className="lg:col-span-2">
                    <LoginsChart />
                </div>
            </div>
        </div>
    );
};