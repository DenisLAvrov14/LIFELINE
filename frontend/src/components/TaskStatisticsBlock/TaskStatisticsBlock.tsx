import React, { useEffect, useState } from "react";
import { TaskStatisticBlock } from "../../models/TaskStaticsBlock";

const TaskStatisticsBlock: React.FC = () => {
  const [tasks, setTasks] = useState<TaskStatisticBlock[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/statistics?userId=00000000-0000-0000-0000-000000000001"
        );
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
    <section className="my-8 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Task Time Statistics
      </h2>
      <div className="bg-white shadow-md rounded-lg p-4">
        <ul className="space-y-4">
          {tasks.map((task, index) => (
            <li
              key={index}
              className="flex justify-between items-center border-b pb-2 last:border-b-0"
            >
              <span className="text-lg font-medium text-gray-700">
                {task.description}
              </span>
              <span className="text-lg text-gray-500">{task.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TaskStatisticsBlock;
