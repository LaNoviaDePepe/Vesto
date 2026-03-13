import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// We define an Interface so TypeScript knows what to expect
interface GraphProps {
    title: string;
    data: any[];     // The list of objects (your prendas or ventas)
    xKey: string;    // The name of the property for the horizontal axis (e.g., 'dia')
    yKey: string;    // The name of the property for the vertical axis (e.g., 'cantidad')
    lineColor?: string; // Optional: default color is blue
}

export default function Graph({ title, data, xKey, yKey, lineColor = "#3b82f6" }: GraphProps) {
    return (
        <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-2 dark:text-white">{title}</h2>

            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis dataKey={xKey} />
                        <YAxis />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey={yKey}
                            stroke={lineColor}
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}