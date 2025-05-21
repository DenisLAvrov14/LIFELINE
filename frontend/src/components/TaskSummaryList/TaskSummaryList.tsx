import React from 'react';

interface TaskSummary {
  description: string;
  totalTime: number;
  count: number;
}

interface TaskSummaryListProps {
  groupedTasks: TaskSummary[];
  totalTime: number;
}

const TaskSummaryList: React.FC<TaskSummaryListProps> = ({
  groupedTasks,
  totalTime,
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-4 sm:p-6">
      {groupedTasks.length > 0 ? (
        <>
          <ul className="space-y-4">
            {groupedTasks.map((task, index) => (
              <li
                key={index}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-gray-300 dark:border-gray-700 pb-2"
              >
                <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                  {task.description} ({task.count})
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {Math.floor(task.totalTime / 3600)}h{' '}
                  {Math.floor((task.totalTime % 3600) / 60)}m{' '}
                  {task.totalTime % 60}s
                </span>
              </li>
            ))}
          </ul>
          <div className="text-center text-sm font-semibold mt-6 text-gray-600 dark:text-gray-400">
            Total time: {Math.floor(totalTime / 3600)}h{' '}
            {Math.floor((totalTime % 3600) / 60)}m {totalTime % 60}s
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">
          No tasks found for the selected filter.
        </p>
      )}
    </div>
  );
};

export default TaskSummaryList;
