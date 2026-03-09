import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Graph from '../components/common/Graph';
import { createItemRepository } from '../database/repositories';

export const StatsPage = () => {
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const itemRepository = createItemRepository();
            const { data, error } = await itemRepository.getNumPrendasDia();

            if (error) {
                toast.error('Error al cargar las estadísticas');
            } else if (data) {
                setChartData(data);
            }
            setLoading(false);
        };

        fetchStats();
    }, []);

    if (loading) return <p className="p-6 text-center">Cargando estadísticas...</p>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Estadísticas de la Aplicación</h1>

            {chartData.length > 0 ? (
                <div className="max-w-4xl mx-auto">
                    <Graph 
                        title="Prendas Registradas por Día" 
                        data={chartData} 
                        xKey="dia"
                        yKey="cantidad"
                        lineColor="#8b5cf6"
                    />
                </div>
            ) : (
                <div className="bg-gray-100 p-10 rounded-xl text-center">
                    <p className="text-gray-500">No hay datos suficientes para mostrar el gráfico.</p>
                </div>
            )}
        </div>
    );
};