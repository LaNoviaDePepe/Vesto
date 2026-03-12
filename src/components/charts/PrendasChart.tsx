import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Graph from './Graph';
import { createItemRepository } from '../../database/repositories';
import { useTranslation } from 'react-i18next';

export const PrendasChart = () => {
    const { t } = useTranslation();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const itemRepository = createItemRepository();
            const { data: chartData, error } = await itemRepository.getNumPrendasDia();

            if (error) {
                toast.error(t('graph.error_loading_items'));
            } else if (chartData) {
                setData(chartData);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-64 flex items-center justify-center">
                <p className="text-gray-400 animate-pulse">{t('graph.loading_items')}</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-6">{t('graph.items_history')}</h2>
            {data.length > 0 ? (
                <Graph
                    title={t('graph.items_per_day')}
                    data={data}
                    xKey="day"
                    yKey="quantity"
                    lineColor="#8b5cf6" // Cambiar color si procede.
                />
            ) : (
                <div className="bg-gray-50 p-10 rounded-xl text-center border border-dashed border-gray-200">
                    <p className="text-gray-400">{t('graph.not_enought_items_data')}</p>
                </div>
            )}
        </div>
    );
};