import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import {
  BiSolidTrash,
  BiTask,
  BiTaskX,
  BiEditAlt,
  BiCheck,
  BiPlay,
  BiPause,
  BiReset,
  BiTimer,
} from "react-icons/bi";
import styles from "./TaskDeck.module.css";
import { Task } from "../../models/Task";
import { TaskInput } from "../../components/TaskInput/TaskInput";
import { IconButton } from "../../components/IconButton/IconButton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import todosService from "../../services/todos.service";

type Props = {
  task: Task;
};

const TaskDeck: React.FC<Props> = ({ task }) => {
  const userId = "00000000-0000-0000-0000-000000000001";

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [inputEdit, setInputEdit] = useState<string>(task.description);
  const [isTimerVisible, setIsTimerVisible] = useState<boolean>(false);
  const [time, setTime] = useState(0); // Время в секундах
  const [isRunning, setIsRunning] = useState(false); // Статус таймера
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0); // Время до паузы

  const handleEdit = useCallback(() => setIsEdit((prev) => !prev), []);
  const queryClient = useQueryClient();

  const mutationDelete = useMutation({
    mutationFn: async (taskId: string) => todosService.deleteTodo(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const onDeleteTask = useCallback(
    () => mutationDelete.mutate(task.id),
    [mutationDelete, task.id]
  );

  const mutationUpdateTask = useMutation({
    mutationFn: async ({ id, description }: { id: string; description: string }) =>
      todosService.updateTodo(id, description, task.isDone),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setIsEdit(false);
    },
  });

  const handleSave = useCallback(
    () => mutationUpdateTask.mutate({ id: task.id, description: inputEdit }),
    [inputEdit, mutationUpdateTask, task.id]
  );

  const handleCancel = useCallback(() => setIsEdit(false), []);
  const handleChangeInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInputEdit(e.target.value);
  }, []);

  // Таймер: старт, пауза, сброс
  const handleStartOrReset = useCallback(() => {
    if (isRunning || elapsedTime > 0) {
      setIsRunning(false);
      setIsTimerVisible(false);
      setElapsedTime(0);
      setStartTime(null);
      setTime(0);
    } else {
      const now = new Date();
      setStartTime(now);
      setIsRunning(true);
      setIsTimerVisible(true);
    }
  }, [isRunning, elapsedTime]);

  const handlePauseOrResume = useCallback(() => {
    if (isRunning) {
      const currentElapsed = elapsedTime + Math.floor((Date.now() - (startTime?.getTime() || 0)) / 1000);
      setElapsedTime(currentElapsed);
      setIsRunning(false);
    } else {
      setStartTime(new Date());
      setIsRunning(true);
    }
  }, [isRunning, elapsedTime, startTime]);

  const handleStopAndMarkAsDone = useCallback(async () => {
    setIsRunning(false);
    const endTime = new Date();
    const duration =
      startTime ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000) + elapsedTime : elapsedTime;

    await todosService.saveTaskTime(task.id, userId, startTime || endTime, endTime, duration);
    await todosService.taskIsDone(task.id);
    queryClient.invalidateQueries({ queryKey: ["todos"] });
    setIsTimerVisible(false);
  }, [startTime, elapsedTime, task.id, userId, queryClient]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && startTime) {
      interval = setInterval(() => {
        setTime(elapsedTime + Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime, elapsedTime]);

  return (
    <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all w-full max-w-lg">
      {/* Task Description or Input */}
      <div className="flex items-center">
        {isEdit ? (
          <TaskInput
            autoFocus
            value={inputEdit}
            onChange={handleChangeInput}
            className="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring focus:ring-blue-300"
          />
        ) : isTimerVisible ? (
          <div className="text-lg font-mono text-gray-800 dark:text-gray-200">
            {String(Math.floor(time / 3600)).padStart(2, "0")}:
            {String(Math.floor((time % 3600) / 60)).padStart(2, "0")}:
            {String(time % 60).padStart(2, "0")}
          </div>
        ) : (
          <p
            className={`font-medium ${
              task.isDone
                ? "line-through text-gray-500 dark:text-gray-400"
                : "text-gray-800 dark:text-gray-200"
            }`}
          >
            {task.description}
          </p>
        )}
      </div>
  
      {/* Action Buttons */}
      <div className="flex space-x-2">
        {isEdit ? (
          <>
            <IconButton
              className="bg-green-500 text-white hover:bg-green-600"
              onClick={handleSave}
            >
              <BiTask title="Save" />
            </IconButton>
            <IconButton
              className="bg-gray-400 text-white hover:bg-gray-500"
              onClick={handleCancel}
            >
              <BiTaskX title="Cancel" />
            </IconButton>
          </>
        ) : isTimerVisible ? (
          <>
            <IconButton
              className="bg-blue-500 text-white hover:bg-blue-600"
              onClick={handleStartOrReset}
            >
              <BiReset title="Reset" />
            </IconButton>
            <IconButton
              className="bg-yellow-400 text-white hover:bg-yellow-500"
              onClick={handlePauseOrResume}
            >
              {isRunning ? <BiPause title="Pause" /> : <BiPlay title="Resume" />}
            </IconButton>
            <IconButton
              className="bg-green-500 text-white hover:bg-green-600"
              onClick={handleStopAndMarkAsDone}
            >
              <BiCheck title="Stop and Mark as Done" />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton
              className="bg-blue-500 text-white hover:bg-blue-600"
              onClick={handleStartOrReset}
            >
              <BiTimer title="Start Timer" />
            </IconButton>
            <IconButton
              className="bg-yellow-400 text-white hover:bg-yellow-500"
              onClick={handleEdit}
            >
              <BiEditAlt title="Edit" />
            </IconButton>
            <IconButton
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={onDeleteTask}
            >
              <BiSolidTrash title="Delete" />
            </IconButton>
          </>
        )}
      </div>
    </div>
  );  
};

export default TaskDeck;
