import React from 'react';
import {
  BiCheck,
  BiEditAlt,
  BiPause,
  BiPlay,
  BiReset,
  BiSolidTrash,
  BiTask,
  BiTaskX,
  BiTimer,
} from 'react-icons/bi';
import { IconButton } from '../IconButton/IconButton';

interface Props {
  isEdit: boolean;
  isTimerVisible: boolean;
  isRunning: boolean;
  isQuickTask: boolean;
  isDone: boolean;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onStartOrReset: () => void;
  onPauseOrResume: () => void;
  onDone: () => void;
  onDelete: () => void;
}

const TaskActions: React.FC<Props> = ({
  isEdit,
  isTimerVisible,
  isRunning,
  isQuickTask,
  isDone,
  onSave,
  onCancel,
  onEdit,
  onStartOrReset,
  onPauseOrResume,
  onDone,
  onDelete,
}) => {
  if (isEdit) {
    return (
      <>
        <IconButton className="bg-green-500" onClick={onSave}>
          <BiTask />
        </IconButton>
        <IconButton className="bg-gray-400" onClick={onCancel}>
          <BiTaskX />
        </IconButton>
      </>
    );
  }

  if (isQuickTask) {
    return (
      <>
        <IconButton
          className="bg-green-500"
          onClick={onDone}
          disabled={isDone}
          title={isDone ? 'Task already completed' : 'Mark as Done'}
        >
          <BiCheck />
        </IconButton>
        <IconButton className="bg-yellow-400" onClick={onEdit}>
          <BiEditAlt title="Edit Task" />
        </IconButton>
        <IconButton className="bg-red-500" onClick={onDelete}>
          <BiSolidTrash title="Delete Task" />
        </IconButton>
      </>
    );
  }

  if (isTimerVisible) {
    return (
      <>
        <IconButton className="bg-blue-500" onClick={onStartOrReset}>
          <BiReset />
        </IconButton>
        <IconButton className="bg-yellow-400" onClick={onPauseOrResume}>
          {isRunning ? <BiPause /> : <BiPlay />}
        </IconButton>
        <IconButton
          className="bg-green-500"
          onClick={onDone}
          disabled={isDone}
          title={isDone ? 'Task already completed' : 'Mark as Done'}
        >
          <BiCheck />
        </IconButton>
      </>
    );
  }

  return (
    <>
      <IconButton className="bg-blue-500" onClick={onStartOrReset}>
        <BiTimer />
      </IconButton>
      <IconButton className="bg-yellow-400" onClick={onEdit}>
        <BiEditAlt />
      </IconButton>
      <IconButton className="bg-red-500" onClick={onDelete}>
        <BiSolidTrash />
      </IconButton>
    </>
  );
};

export default TaskActions;
