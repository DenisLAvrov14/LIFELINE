import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getWeeklyStats } from '../../services/todos.service';

const TaskStatisticsBlock: React.FC = () => {
  const [filter, setFilter] = useState<'day' | 'week' | 'month' | 'all'>('all');
  const userId = '00000000-0000-0000-0000-000000000001';

  // Получаем данные через React Query
  const {
    data: tasks,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['weeklyStats', userId],
    queryFn: () => getWeeklyStats(userId),
    refetchOnWindowFocus: false,
    staleTime: 60000, // 1 минута кеша
  });

  console.log('Fetched tasks:', tasks); // Переместил после получения данных

  // Группировка задач
  const groupedTasks = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];

    const grouped: { [key: string]: { totalTime: number; count: number } } = {};

    tasks.forEach((task: any) => {
      const key = task.description || task.task_id;

      if (!grouped[key]) {
        grouped[key] = { totalTime: 0, count: 0 };
      }

      // Преобразуем строки в числа
      grouped[key].totalTime += Number(task.total_time);
      grouped[key].count += Number(task.task_count);
    });

    console.log('Grouped tasks:', grouped); // Лог группировки

    return Object.entries(grouped).map(([description, stats]) => ({
      description,
      totalTime: stats.totalTime,
      count: stats.count,
    }));
  }, [tasks]);

  // Фильтрация задач
  const filteredTasks = useMemo(() => {
    if (!groupedTasks || groupedTasks.length === 0) return [];

    const now = new Date();

    const result = groupedTasks.filter(({ description }) => {
      const taskDates = tasks?.filter(
        (task: any) => task.description === description
      );
      const match = taskDates?.some((task: any) => {
        // Проверяем, есть ли дата, и сравниваем с текущим временем
        const taskDate = task.date ? new Date(task.date) : now;

        switch (filter) {
          case 'day':
            return taskDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date();
            weekAgo.setDate(now.getDate() - 7);
            return taskDate >= weekAgo && taskDate <= now;
          case 'month':
            return (
              taskDate.getMonth() === now.getMonth() &&
              taskDate.getFullYear() === now.getFullYear()
            );
          default:
            return true;
        }
      });
      return match || false;
    });

    console.log('Filtered tasks:', result); // Лог фильтрации

    return result;
  }, [filter, groupedTasks, tasks]);

  if (isLoading) {
    return <p>Loading tasks...</p>;
  }

  if (isError) {
    return <p>Failed to load tasks. Please try again later.</p>;
  }

  return (
    <section className="my-8 max-w-3xl mx-auto bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">
        Task Time Statistics
      </h2>

      {/* Фильтры */}
      <div className="flex justify-center mb-6 space-x-4">
        {['day', 'week', 'month', 'all'].map((option) => (
          <button
            key={option}
            onClick={() =>
              setFilter(option as 'day' | 'week' | 'month' | 'all')
            }
            className={`px-4 py-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              filter === option
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
            }`}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>

      {/* Список задач */}
      <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6">
        {filteredTasks.length > 0 ? (
          <ul className="space-y-4">
            {filteredTasks.map((task, index) => (
              <li
                key={index}
                className="flex justify-between items-center border-b border-gray-300 dark:border-gray-700 pb-2 last:border-b-0"
              >
                <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  {task.description} ({task.count})
                </span>
                <span className="text-lg font-medium text-gray-500 dark:text-gray-400">
                  {/* Добавляем отображение секунд */}
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
            No tasks found for the selected filter
          </p>
        )}
      </div>
    </section>
  );
};

export default TaskStatisticsBlock;
