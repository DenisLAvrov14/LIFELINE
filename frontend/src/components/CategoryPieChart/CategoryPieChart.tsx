import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
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

  const chartMargins = isMobile
    ? { top: 0, bottom: 0, right: 0, left: 0 }
    : { top: 20, bottom: 20, right: 100, left: 0 };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-[280px] sm:max-w-full aspect-square">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={chartMargins}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={isMobile ? 90 : 100}
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
            {!isMobile && (
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                iconType="circle"
              />
            )}
          </PieChart>
        </ResponsiveContainer>
      </div>

      {isMobile && (
        <div className="mt-4 flex flex-col items-start gap-1 text-sm w-full px-6">
          {data.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-2">
              <span
                className="inline-block w-3.5 h-3.5 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></span>
              <span className="text-gray-700 dark:text-gray-200">
                {entry.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPieChart;
