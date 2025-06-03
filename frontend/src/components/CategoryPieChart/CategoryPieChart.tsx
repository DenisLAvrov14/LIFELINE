import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useMediaQuery } from 'react-responsive';

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
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  const chartHeight = isMobile ? 240 : 320;

  return (
    <div className="w-full flex flex-col items-center gap-4 mt-6 mb-2">
      <div className="w-full max-w-2xl h-[320px] sm:h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={isMobile ? 90 : 120}
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
              formatter={(value: number) => {
                const h = Math.floor(value / 3600);
                const m = Math.floor((value % 3600) / 60);
                const s = value % 60;
                const percent = ((value / total) * 100).toFixed(1);
                return [`${h}h ${m}m ${s}s (${percent}%)`, 'Total time'];
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap justify-center gap-3 text-sm w-full max-w-4xl px-4">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span
              className="inline-block w-3.5 h-3.5 rounded-full"
              style={{ backgroundColor: colors[index % colors.length] }}
            ></span>
            <span className="text-gray-700 dark:text-gray-200 break-all max-w-[150px]">
              {entry.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPieChart;
