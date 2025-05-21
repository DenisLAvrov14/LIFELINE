import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface CategoryPieChartProps {
  data: { name: string; value: number }[];
  colors?: string[];
}

const DEFAULT_COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7f50',
  '#00bcd4',
  '#ff69b4',
  '#a78bfa',
  '#f97316',
  '#10b981',
  '#f43f5e',
  '#4ade80',
  '#60a5fa',
  '#facc15',
  '#e879f9',
  '#2dd4bf',
];

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({
  data,
  colors = DEFAULT_COLORS,
}) => {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="w-full h-[360px] mb-8">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ right: 100 }}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            fill="#8884d8"
            label={false}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string, props: any) => {
              const h = Math.floor(value / 3600);
              const m = Math.floor((value % 3600) / 60);
              const s = value % 60;
              const percent = ((value / total) * 100).toFixed(1);
              return [`${h}h ${m}m ${s}s (${percent}%)`, 'Total time'];
            }}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPieChart;
