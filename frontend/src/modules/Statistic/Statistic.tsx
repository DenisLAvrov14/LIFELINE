import TaskStatisticsBlock from '../../components/TaskStatisticsBlock/TaskStatisticsBlock';

const Statistics: React.FC = () => {
  return (
    <div className="container mx-auto p-6 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-lg shadow-lg">
      {/* Блок с аватаром */}
      {/* <div className="flex items-center justify-center my-6">
        <AvatarBlock imageUrl="/path-to-avatar.jpg" />
      </div> */}

      {/* Заголовок страницы */}
      <h1 className="text-4xl font-extrabold text-center mb-8">NAME NAME</h1>

      {/* Секции характеристик */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <ProgressSection title="Physical Health and Activity" items={healthStats} />
        <ProgressSection title="Intellectual Development" items={intellectualStats} />
        <ProgressSection title="Social Activity and Community Contribution" items={socialStats} />
        <ProgressSection title="Knowledge and Languages" items={knowledgeStats} />
      </div> */}

      {/* Блок статистики задач */}
      <div className="mt-8">
        <TaskStatisticsBlock />
      </div>
    </div>
  );
};

export default Statistics;
