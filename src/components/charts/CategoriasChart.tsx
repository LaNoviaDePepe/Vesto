import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { createItemRepository } from '../../database/repositories';
import PieGraph from '../common/PieGraph';

export const CategoriasChart = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const itemRepository = createItemRepository();
            const { data: chartData, error } = await itemRepository.getPrendasPorCategoria();

            if (error) {
                toast.error('Error al cargar datos de categorías');
            } else if (chartData) {
                setData(chartData);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-95 flex items-center justify-center">
                <p className="text-gray-400 animate-pulse">Analizando categorías...</p>
            </div>
        );
    }

    // Si no hay datos suficientes
    if (data.length === 0) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-95 flex items-center justify-center">
                <div className="bg-gray-50 p-10 rounded-xl text-center border border-dashed border-gray-200">
                    <p className="text-gray-400">Aún no hay prendas suficientes.</p>
                </div>
            </div>
        );
    }

    return (
        <PieGraph 
            title="Distribución por Categoría" 
            data={data} 
            nameKey="name" 
            dataKey="value" 
        />
    );
};