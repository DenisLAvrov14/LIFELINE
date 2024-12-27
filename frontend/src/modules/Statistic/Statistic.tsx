import React, { useEffect, useState } from "react";
import TaskStatisticsBlock from "../../components/TaskStatisticsBlock/TaskStatisticsBlock";
import AvatarBlock from "../../components/AvatarBlock/AvatarBlock";
import ProgressSection from "../../components/ProgressSection/ProgressSection";

const Statistics: React.FC = () => {
  // Хуки для данных
  const [healthStats, setHealthStats] = useState([
    { label: "Health", value: 70 },
    { label: "Fitness", value: 50 },
  ]);

  const [intellectualStats, setIntellectualStats] = useState([
    { label: "Intelligence", value: 80 },
    { label: "Creativity", value: 60 },
  ]);

  const [socialStats, setSocialStats] = useState([
    { label: "Social Ability", value: 90 },
    { label: "Community Contribution", value: 40 },
    { label: "Environmental Responsibility", value: 30 },
  ]);

  const [knowledgeStats, setKnowledgeStats] = useState([
    { label: "Specialized Knowledge", value: 75 },
    { label: "Foreign Language Proficiency", value: 85 },
  ]);

  return (
    <div className="container mx-auto p-6 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-lg shadow-lg">
      {/* Блок с аватаром */}
      {/* <div className="flex items-center justify-center my-6">
        <AvatarBlock imageUrl="/path-to-avatar.jpg" />
      </div> */}
  
      {/* Заголовок страницы */}
      <h1 className="text-4xl font-extrabold text-center mb-8">
        NAME NAME
      </h1>
  
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
