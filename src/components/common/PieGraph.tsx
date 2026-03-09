import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PieGraphProps {
    title: string;
    data: any[];
    nameKey: string; // La propiedad para el nombre (ej. 'name')
    dataKey: string; // La propiedad para el valor numérico (ej. 'value')
}

// Cambiar los colores.
const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#6366f1'];

export default function PieGraph({ title, data, nameKey, dataKey }: PieGraphProps) {
    return (
        <div className="p-4 bg-white rounded-xl shadow-md h-full flex flex-col">
            <h2 className="text-lg font-semibold mb-2">{title}</h2>

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
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}