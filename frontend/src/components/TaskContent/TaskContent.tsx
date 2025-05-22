import React from 'react';
import { TaskInput } from '../TaskInput/TaskInput';
import { TaskContentProps } from '../../models/TaskContentProps';

const TaskContent: React.FC<TaskContentProps> = ({
  task,
  isEdit,
  inputEdit,
  onChange,
  isTimerVisible,
  time,
}) => {
  if (isEdit) {
    return (
      <TaskInput
        autoFocus
        value={inputEdit}
        onChange={onChange}
        className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 focus:ring focus:ring-blue-300"
      />
    );
  }

  if (isTimerVisible) {
    return (
      <div className="text-lg font-mono text-gray-800 dark:text-gray-200">
        {String(Math.floor(time / 3600)).padStart(2, '0')}:
        {String(Math.floor((time % 3600) / 60)).padStart(2, '0')}:
        {String(time % 60).padStart(2, '0')}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <p
        className={`font-medium ${
          task.isDone
            ? 'line-through text-gray-500 dark:text-gray-400'
            : 'text-gray-800 dark:text-gray-200'
        }`}
      >
        {task.description}
      </p>

      {task.hasTimer && task.alarmTime && (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Alarm set for: {new Date(task.alarmTime).toLocaleString()}
        </span>
      )}
    </div>
  );
};

export default TaskContent;
