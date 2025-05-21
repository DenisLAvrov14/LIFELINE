import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFilteredStats } from '../../services/todos.service';
import { useKeycloak } from '@react-keycloak/web';
import StatisticsFilters from '../StatisticsFilters/StatisticsFilters';
import CategoryPieChart from '../CategoryPieChart/CategoryPieChart';
import TaskSummaryList from '../TaskSummaryList/TaskSummaryList';

const categories = [
  'Health',
  'Fitness',
  'Intelligence',
  'Creativity',
  'Social Ability',
  'Community Contribution',
  'Environmental Responsibility',
  'Specialized Knowledge',
  'Foreign Language Proficiency',
];

const TaskStatisticsBlock: React.FC = () => {
  const { keycloak } = useKeycloak();
  const [filter, setFilter] = useState<'day' | 'week' | 'month' | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [chartView, setChartView] = useState<'category' | 'task'>('category');

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
    queryKey: ['todos', keycloak.token],
    queryFn: () => {
      if (!keycloak.token || !keycloak.tokenParsed?.sub) {
        throw new Error('Token or userId is missing');
      }
      return getFilteredStats(keycloak.token, keycloak.tokenParsed.sub);
    },
    refetchOnWindowFocus: true,
    staleTime: 60000,
  });

  const filteredTasks = useMemo(() => {
    if (!Array.isArray(tasks) || tasks.length === 0) return [];
    return tasks.filter((task: any) => {
      const taskDate = new Date(task.last_completed_at);
      const inDate = taskDate >= startDate && taskDate <= endDate;
      const inCategory =
        selectedCategory === 'all' || task.category === selectedCategory;
      const inFolder =
        selectedFolder === 'all' || task.folder_id === selectedFolder;
      return inDate && inCategory && inFolder;
    });
  }, [tasks, startDate, endDate, selectedCategory, selectedFolder]);

  const groupedTasks = useMemo(() => {
    const grouped: { [key: string]: { totalTime: number; count: number } } = {};
    filteredTasks.forEach((task: any) => {
      const key = task.description || task.task_id;
      if (!grouped[key]) grouped[key] = { totalTime: 0, count: 0 };
      grouped[key].totalTime += Number(task.total_time);
      grouped[key].count += Number(task.task_count);
    });
    return Object.entries(grouped).map(([description, stats]) => ({
      description,
      totalTime: stats.totalTime,
      count: stats.count,
    }));
  }, [filteredTasks]);

  const categoryChartData = useMemo(() => {
    const map: { [key: string]: number } = {};
    filteredTasks.forEach((task: any) => {
      const category = task.category || 'Uncategorized';
      map[category] = (map[category] || 0) + Number(task.total_time);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredTasks]);

  const taskChartData = useMemo(() => {
    const map: { [key: string]: number } = {};
    filteredTasks.forEach((task: any) => {
      const desc = task.description || 'Unnamed Task';
      map[desc] = (map[desc] || 0) + Number(task.total_time);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredTasks]);

  const totalTime = groupedTasks.reduce((sum, task) => sum + task.totalTime, 0);

  const folderIds = useMemo(() => {
    if (!Array.isArray(tasks)) return [];
    const set = new Set<string>();
    tasks.forEach((task: any) => {
      if (task.folder_id) set.add(task.folder_id);
    });
    return Array.from(set);
  }, [tasks]);

  if (isLoading) return <p>Loading tasks...</p>;
  if (isError) return <p>Failed to load tasks. Please try again later.</p>;

  return (
    <section className="my-8 max-w-3xl mx-auto bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg shadow-lg p-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 tracking-tight text-gray-900 dark:text-white">
        Task Time Statistics
      </h2>

      <StatisticsFilters
        filter={filter}
        setFilter={setFilter}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedFolder={selectedFolder}
        setSelectedFolder={setSelectedFolder}
        folderIds={folderIds}
        categories={categories}
      />

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setChartView('category')}
          className={`px-3 py-1 rounded ${chartView === 'category' ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-700'}`}
        >
          By Category
        </button>
        <button
          onClick={() => setChartView('task')}
          className={`px-3 py-1 rounded ${chartView === 'task' ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-700'}`}
        >
          By Task
        </button>
      </div>

      <CategoryPieChart
        data={chartView === 'category' ? categoryChartData : taskChartData}
      />

      <TaskSummaryList groupedTasks={groupedTasks} totalTime={totalTime} />
    </section>
  );
};

export default TaskStatisticsBlock;
