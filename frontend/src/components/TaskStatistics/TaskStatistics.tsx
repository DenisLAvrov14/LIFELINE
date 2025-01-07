import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TaskStats } from '../../models/TaskStat';

const TaskStatistics: React.FC = () => {
  const [stats, setStats] = useState<TaskStats[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const userId = '00000000-0000-0000-0000-000000000001'; // Используем ваш userId
        const response = await axios.get('http://localhost:3001/statistics', {
          params: { userId },
        });
        setStats(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError('Failed to fetch statistics. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (isLoading) return <p>Loading statistics...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-4">
        Weekly Task Statistics
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-left">
                Task ID
              </th>
              <th className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-left">
                Total Time (hours)
              </th>
              <th className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-left">
                Task Count
              </th>
            </tr>
          </thead>
          <tbody>
            {stats.map((stat) => (
              <tr
                key={stat.task_id}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">
                  {stat.task_id}
                </td>
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">
                  {(stat.total_time / 60).toFixed(2)}
                </td>
                <td className="px-4 py-2 border border-gray-300 dark:border-gray-600">
                  {stat.task_count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskStatistics;
