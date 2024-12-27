import React, { useMemo } from "react";
import { useTodos } from "../../hooks/useTodos";
import { Task } from "../../models/Task";
import TaskDeck from "../../components/TaskDeck/TaskDeck";
import { RootState, useSelector } from "../../redux/store";
import CreateTask from "../../components/CreateTask/CraeteTask";

const Todo: React.FC = () => {
  const filter = useSelector((state: RootState) => state.tasks.filter);

  const { isLoading, data: queryData } = useTodos();

  // Фильтрация задач на основе текущего значения фильтра из Redux
  const filteredData = useMemo(() => {
    if (!queryData) return [];

    switch (filter) {
      case "all":
        return queryData;
      case "done":
        return queryData.filter((task: Task) => task.isDone === true);
      case "undone":
        return queryData.filter((task: Task) => task.isDone === false);
      default:
        return [];
    }
  }, [filter, queryData]);

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-200">
      {/* Создание новой задачи */}
      <div className="w-full max-w-3xl mb-8">
        <CreateTask />
      </div>
  
      {/* Список задач */}
      <div className="w-full max-w-3xl">
        {isLoading ? (
          <div className="text-center text-lg text-gray-600 dark:text-gray-400 animate-pulse">
            Loading...
          </div>
        ) : filteredData?.length ? (
          <ul className="space-y-6">
            {filteredData.map((task: Task) => (
              <TaskDeck key={task.id} task={task} />
            ))}
          </ul>
        ) : (
          <h1 className="text-center text-2xl font-semibold text-red-600 dark:text-red-400">
            No tasks found
          </h1>
        )}
      </div>
    </div>
  );  
};

export default Todo;
