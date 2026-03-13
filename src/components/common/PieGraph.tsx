import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Propiedades esperadas por el componente PieGraph.
 * @interface PieGraphProps
 */
interface PieGraphProps {
    title: string;
    data: any[];
    nameKey: string; // La propiedad para el nombre (ej. 'name')
    dataKey: string; // La propiedad para el valor numérico (ej. 'value')
}

/** Paleta de colores predefinida para las porciones del gráfico.
 * 
 */
const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#6366f1'];

/**
 * Componente genérico para renderizar un gráfico circular tipo Donut (PieChart).
 * Este componente es puramente visual (Presentacional). Recibe los datos a través de props
 * y los renderiza utilizando la librería Recharts, adaptándose al 100% del contenedor padre.
 * @component
 * @param {PieGraphProps} props - Propiedades del componente.
 * @returns {JSX.Element} Un contenedor estilizado con el gráfico circular renderizado.
 */
export default function PieGraph({ title, data, nameKey, dataKey }: PieGraphProps) {
    return (
        <div className="p-4 bg-white dark:bg-gray-900 border rounded-xl shadow-md h-full flex flex-col transition-colors duration-300 border-gray-100">
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white transition-colors duration-300">{title}</h2>

            <div className="flex-1 w-full min-h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={70} // El hueco central para que sea un Donut Chart
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey={dataKey}
                            nameKey={nameKey}
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend verticalAlign="bottom" iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}