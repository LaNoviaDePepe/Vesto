import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { createUserRepository } from '../../database/repositories';
import Graph from './Graph';
import { useTranslation } from 'react-i18next';

export const LoginsChart = () => {
    const { t } = useTranslation();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const userRepository = createUserRepository();
            const { data: chartData, error } = await userRepository.getDailyLogins();

            if (error) {
                toast.error(t('graph.error_loading_logins'));
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
                <p className="text-gray-400 animate-pulse">{t('graph.loading_logins')}</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-6">{t('graph.user_traffic')}</h2>
            {data.length > 0 ? (
                <Graph 
                    title={t('graph.daily_logins')}
                    data={data} 
                    xKey="day"
                    yKey="total_logins"
                    lineColor="#10b981" // Cambiar el color verde
                />
            ) : (
                <div className="bg-gray-50 p-10 rounded-xl text-center border border-dashed border-gray-200">
                    <p className="text-gray-400">{t('graph.not_enought_logins_data')}</p>
                </div>
            )}
        </div>
    );
};