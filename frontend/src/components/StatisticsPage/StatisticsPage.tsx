import React from 'react';
import AvatarBlock from '../AvatarBlock/AvatarBlock';
import ProgressSection from '../ProgressSection/ProgressSection';
import TaskStatisticsBlock from '../TaskStatisticsBlock/TaskStatisticsBlock';

const StatisticsPage: React.FC = () => {
  const healthItems = [
    { label: 'Health', value: 70 },
    { label: 'Fitness', value: 50 },
  ];

  const intellectualItems = [
    { label: 'Intelligence', value: 80 },
    { label: 'Creativity', value: 60 },
  ];

  const socialItems = [
    { label: 'Social Ability', value: 90 },
    { label: 'Community Contribution', value: 40 },
    { label: 'Environmental Responsibility', value: 30 },
  ];

  const knowledgeItems = [
    { label: 'Specialized Knowledge', value: 75 },
    { label: 'Foreign Language Proficiency', value: 85 },
  ];

  const taskStatistics = [
    { name: 'Task 1', time: '2h 30m' },
    { name: 'Task 2', time: '1h 15m' },
    { name: 'Task 3', time: '3h 45m' },
  ];

  return (
    <div className="flex flex-col items-center p-4 sm:p-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200">
      {/* Блок аватара */}
      <div className="mb-6">
        <AvatarBlock />
      </div>

      {/* Основной блок статистики */}
      <div className="w-full max-w-3xl sm:max-w-4xl bg-white dark:bg-gray-800 shadow-md sm:shadow-lg rounded-lg p-4 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-4 sm:mb-6">
          NAME NAME
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <ProgressSection
            title="Physical Health and Activity"
            items={healthItems}
          />
          <ProgressSection
            title="Intellectual Development"
            items={intellectualItems}
          />
          <ProgressSection
            title="Social Activity and Community Contribution"
            items={socialItems}
          />
          <ProgressSection
            title="Knowledge and Languages"
            items={knowledgeItems}
          />
        </div>

        {/* Блок статистики задач */}
        <div className="mt-6 sm:mt-8">
          <TaskStatisticsBlock />
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
