import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./TaskStatistics.module.css"; // Создайте файл стилей, если нужно.
import { TaskStat } from "../../models/TaskStat";

const TaskStatistics: React.FC = () => {
  const [stats, setStats] = useState<TaskStat[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const userId = "00000000-0000-0000-0000-000000000001"; // Используем ваш userId
        const response = await axios.get("http://localhost:3001/statistics", {
          params: { userId },
        });
        setStats(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching statistics:", err);
        setError("Failed to fetch statistics. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (isLoading) return <p>Loading statistics...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.statisticsContainer}>
      <h2>Weekly Task Statistics</h2>
      <table className={styles.statisticsTable}>
        <thead>
          <tr>
            <th>Task ID</th>
            <th>Total Time (hours)</th>
            <th>Task Count</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((stat) => (
            <tr key={stat.task_id}>
              <td>{stat.task_id}</td>
              <td>{(stat.total_time / 60).toFixed(2)}</td>
              <td>{stat.task_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskStatistics;
