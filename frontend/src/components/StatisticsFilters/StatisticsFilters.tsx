import React from 'react';

interface StatisticsFiltersProps {
  filter: 'day' | 'week' | 'month' | 'all';
  setFilter: (value: 'day' | 'week' | 'month' | 'all') => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedFolder: string;
  setSelectedFolder: (value: string) => void;
  folderIds: string[];
  categories: string[];
  chartView: 'category' | 'task';
  setChartView: (value: 'category' | 'task') => void;
}

const StatisticsFilters: React.FC<StatisticsFiltersProps> = ({
  filter,
  setFilter,
  selectedCategory,
  setSelectedCategory,
  selectedFolder,
  setSelectedFolder,
  folderIds,
  categories,
  chartView,
  setChartView,
}) => {
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Временной фильтр */}
      <div className="flex flex-wrap justify-center gap-2">
        {['day', 'week', 'month', 'all'].map((option) => (
          <button
            key={option}
            onClick={() =>
              setFilter(option as 'day' | 'week' | 'month' | 'all')
            }
            className={`px-3 py-2 text-sm rounded-md transition-all ${
              filter === option
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>

      {/* Группа фильтров для диаграммы */}
      <div className="w-full max-w-6xl flex flex-col sm:flex-row sm:items-end sm:justify-center gap-4">
        {/* Category */}
        <div className="flex flex-col w-full sm:w-1/3">
          <label htmlFor="category-select" className="text-sm font-medium mb-1">
            Category:
          </label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-sm rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white w-full"
          >
            <option value="all">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Folder */}
        <div className="flex flex-col w-full sm:w-1/3">
          <label htmlFor="folder-select" className="text-sm font-medium mb-1">
            Folder:
          </label>
          <select
            id="folder-select"
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="px-3 py-2 text-sm rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white w-full"
          >
            <option value="all">All</option>
            {folderIds.map((fid) => (
              <option key={fid} value={fid}>
                {fid.slice(0, 8)}...{fid.slice(-4)}
              </option>
            ))}
          </select>
        </div>

        {/* Chart View Buttons */}
        <div className="flex flex-col w-full sm:w-1/3 gap-1">
          <label className="invisible select-none">Chart View:</label>
          <div className="flex gap-2">
            <button
              onClick={() => setChartView('category')}
              className={`px-3 py-2 text-sm rounded-md transition-all ${
                chartView === 'category'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              By Category
            </button>
            <button
              onClick={() => setChartView('task')}
              className={`px-3 py-2 text-sm rounded-md transition-all ${
                chartView === 'task'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              By Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsFilters;
