import React, { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getFilteredStats } from '../../services/todos.service';

const TaskStatisticsBlock: React.FC = () => {
  const [filter, setFilter] = useState<'day' | 'week' | 'month' | 'all'>('all');
  const userId = '00000000-0000-0000-0000-000000000001';
  const queryClient = useQueryClient();

  const getDateRange = () => {
    const now = new Date();
    let startDate: Date;

    switch (filter) {
      case 'day':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        startDate = new Date(0);
        break;
    }

    return { startDate, endDate: new Date() };
  };

  const { startDate, endDate } = getDateRange();

  const {
    data: tasks,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['todos', userId], // Унифицированный ключ
    queryFn: () => getFilteredStats(userId),
    refetchOnWindowFocus: true,
    staleTime: 60000,
  });

  const filteredTasks = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];

    return tasks.filter((task: any) => {
      const taskDate = new Date(task.last_completed_at);
      return taskDate >= startDate && taskDate <= endDate;
    });
  }, [tasks, startDate, endDate]);

  const groupedTasks = useMemo(() => {
    if (filteredTasks.length === 0) return [];

    const grouped: { [key: string]: { totalTime: number; count: number } } = {};

    filteredTasks.forEach((task: any) => {
      const key = task.description || task.task_id;

      if (!grouped[key]) {
        grouped[key] = { totalTime: 0, count: 0 };
      }

      grouped[key].totalTime += Number(task.total_time);
      grouped[key].count += Number(task.task_count);
    });

    return Object.entries(grouped).map(([description, stats]) => ({
      description,
      totalTime: stats.totalTime,
      count: stats.count,
    }));
  }, [filteredTasks]);

  if (isLoading) {
    return <p>Loading tasks...</p>;
  }

  if (isError) {
    return <p>Failed to load tasks. Please try again later.</p>;
  }

  return (
    <section className="my-8 max-w-3xl mx-auto bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg shadow-lg p-4">
      {/* Заголовок */}
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 text-center">
        Task Time Statistics
      </h2>

      {/* Фильтры */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {['day', 'week', 'month', 'all'].map((option) => (
          <button
            key={option}
            onClick={() =>
              setFilter(option as 'day' | 'week' | 'month' | 'all')
            }
            className={`px-3 py-2 text-sm sm:text-base rounded-md transition-all ${
              filter === option
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>

      {/* Список задач */}
      <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-4 sm:p-6">
        {groupedTasks.length > 0 ? (
          <ul className="space-y-4">
            {groupedTasks.map((task, index) => (
              <li
                key={index}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 border-b border-gray-300 dark:border-gray-700 pb-2 last:border-b-0"
              >
                <span className="font-medium text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  {task.description} ({task.count})
                </span>
                <span className="font-medium text-sm sm:text-base text-gray-500 dark:text-gray-400">
                  {task.totalTime > 0
                    ? `${Math.floor(task.totalTime / 3600)}h ${Math.floor(
                        (task.totalTime % 3600) / 60
                      )}m ${task.totalTime % 60}s`
                    : '0h 0m 0s'}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">
            No tasks found for the selected filter.
          </p>
        )}
      </div>
    </section>
  );
};

export default TaskStatisticsBlock;
