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
}) => {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap justify-center sm:items-center gap-4 mb-6">
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

      {/* Категории и папки */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <label htmlFor="category-select" className="font-medium text-sm">
          Category:
        </label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 text-sm rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
        >
          <option value="all">All</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <label htmlFor="folder-select" className="font-medium text-sm ml-2">
          Folder:
        </label>
        <select
          id="folder-select"
          value={selectedFolder}
          onChange={(e) => setSelectedFolder(e.target.value)}
          className="px-3 py-2 text-sm rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
        >
          <option value="all">All</option>
          {folderIds.map((fid) => (
            <option key={fid} value={fid}>
              {fid.slice(0, 8)}...{fid.slice(-4)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default StatisticsFilters;
