import React, { useEffect, useState } from "react";
import styles from "./TaskStatisticsBlock.module.css";
import { TaskStatisticBlock } from "../../models/TaskStaticsBlock";

const TaskStatisticsBlock: React.FC = () => {
  const [tasks, setTasks] = useState<TaskStatisticBlock[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:3001/statistics?userId=00000000-0000-0000-0000-000000000001");
        const data = await response.json();

        const formattedData = data.map((item: any) => {
          const totalSeconds = item.total_time;
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;

          return {
            description: item.description || item.task_id,
            time: `${hours}h ${minutes}m ${seconds}s`,
          };
        });

        setTasks(formattedData);
      } catch (error) {
        console.error("Failed to fetch task statistics:", error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <section className={styles.taskStatisticsSection}>
      <h2>Task Time Statistics</h2>
      <div className={styles.taskStatisticsContainer}>
        <ul>
          {tasks.map((task, index) => (
            <li key={index}>
              <span className={styles.taskName}>{task.description}</span>
              <span className={styles.taskTime}>{task.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TaskStatisticsBlock;
