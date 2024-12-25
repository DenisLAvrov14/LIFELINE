import React, { useEffect, useState } from "react";
import styles from "./Statistics.module.css";
import AvatarBlock from "../../components/AvatarBlock/AvatarBlock";
import ProgressSection from "../../components/ProgressSection/ProgressSection";
import TaskStatisticsBlock from "../../components/TaskStatisticsBlock/TaskStatisticsBlock";

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

  const [taskStats, setTaskStats] = useState([
    { name: "Task 1", time: "2h 30m" },
    { name: "Task 2", time: "1h 15m" },
    { name: "Task 3", time: "3h 45m" },
  ]);

  return (
    <div className={styles.userBlock}>
      {/* Блок с аватаром */}
      {/* <AvatarBlock /> */}

      <div className={styles.statistics}>
        <h1>NAME NAME</h1>
        <div className={styles.container}>
          {/* Секции характеристик */}
          {/* <ProgressSection title="Physical Health and Activity" items={healthStats} />
          <ProgressSection title="Intellectual Development" items={intellectualStats} />
          <ProgressSection title="Social Activity and Community Contribution" items={socialStats} />
          <ProgressSection title="Knowledge and Languages" items={knowledgeStats} /> */}
        </div>

        {/* Блок статистики задач */}
        <TaskStatisticsBlock />
      </div>
    </div>
  );
};

export default Statistics;
