import React from "react";
import styles from "./StatisticsPage.module.css";
import AvatarBlock from "../AvatarBlock/AvatarBlock";
import ProgressSection from "../ProgressSection/ProgressSection";
import TaskStatisticsBlock from "../TaskStatisticsBlock/TaskStatisticsBlock";

const StatisticsPage: React.FC = () => {
  const healthItems = [
    { label: "Health", value: 70 },
    { label: "Fitness", value: 50 },
  ];

  const intellectualItems = [
    { label: "Intelligence", value: 80 },
    { label: "Creativity", value: 60 },
  ];

  const socialItems = [
    { label: "Social Ability", value: 90 },
    { label: "Community Contribution", value: 40 },
    { label: "Environmental Responsibility", value: 30 },
  ];

  const knowledgeItems = [
    { label: "Specialized Knowledge", value: 75 },
    { label: "Foreign Language Proficiency", value: 85 },
  ];

  const taskStatistics = [
    { name: "Task 1", time: "2h 30m" },
    { name: "Task 2", time: "1h 15m" },
    { name: "Task 3", time: "3h 45m" },
  ];

  return (
    <div className={styles.statisticsPage}>
      <AvatarBlock />
      <div className={styles.statistics}>
        <h1>NAME NAME</h1>
        <div className={styles.container}>
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
        <TaskStatisticsBlock tasks={taskStatistics} />
      </div>
    </div>
  );
};

export default StatisticsPage;
