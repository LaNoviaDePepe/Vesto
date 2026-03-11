import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Graph from './Graph';
import { createItemRepository } from '../../database/repositories';

export const PrendasChart = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const itemRepository = createItemRepository();
            const { data: chartData, error } = await itemRepository.getNumPrendasDia();

            if (error) {
                toast.error('Error al cargar datos de prendas');
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
                <p className="text-gray-400 animate-pulse">Cargando gráfico de prendas...</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-6">Prendas Registradas (Histórico)</h2>
            {data.length > 0 ? (
                <Graph
                    title="Prendas por Día"
                    data={data}
                    xKey="day"
                    yKey="quantity"
                    lineColor="#8b5cf6" // Cambiar color si procede.
                />
            ) : (
                <div className="bg-gray-50 p-10 rounded-xl text-center border border-dashed border-gray-200">
                    <p className="text-gray-400">Sin datos de prendas suficientes.</p>
                </div>
            )}
        </div>
    );
};