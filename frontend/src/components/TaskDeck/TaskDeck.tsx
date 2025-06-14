import React, { ChangeEvent, useCallback, useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useKeycloak } from '@react-keycloak/web';
import { Task } from '../../models/Task';
import todosService from '../../services/todos.service';
import TaskContent from '../TaskContent/TaskContent';
import TaskActions from '../TaskActions/TaskActions';
import { useTaskTimer } from '../../hooks/useTaskTimer';
import { useAlarmTrigger } from '../../hooks/useAlarmTrigger';
import posthog from 'posthog-js';

interface Props {
  task: Task;
}

const TaskDeck: React.FC<Props> = ({ task }) => {
  const { keycloak } = useKeycloak();
  const queryClient = useQueryClient();

  const [isEdit, setIsEdit] = useState(false);
  const [inputEdit, setInputEdit] = useState(task.description);
  const [shouldBlink, setShouldBlink] = useState(false);

  const {
    isRunning,
    setIsRunning,
    startTime,
    setStartTime,
    elapsedTime,
    setElapsedTime,
    time,
    isTimerVisible,
    setIsTimerVisible,
  } = useTaskTimer(task.id);

  const isAlarmTriggered = useAlarmTrigger(
    task.alarmTime ?? null,
    task.hasTimer ?? false,
    task.description
  );

  useEffect(() => {
    if (isAlarmTriggered && !task.isDone) {
      setShouldBlink(true);
    }
  }, [isAlarmTriggered, task.isDone]);

  const handleEdit = useCallback(() => setIsEdit((prev) => !prev), []);
  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) =>
    setInputEdit(e.target.value);
  const handleCancel = () => setIsEdit(false);
  const handleSave = () =>
    mutationUpdate.mutate({ id: task.id, description: inputEdit });

  const handleStartOrReset = () => {
    setShouldBlink(false);
    if (isRunning || elapsedTime > 0) {
      setIsRunning(false);
      setIsTimerVisible(false);
      setElapsedTime(0);
      setStartTime(null);
      setTime(0);
    } else {
      setStartTime(new Date());
      setIsRunning(true);
      setIsTimerVisible(true);
    }
  };

  const setTime = (_t: number) => {
    // пока не используется
  };

  const handlePauseOrResume = () => {
    if (isRunning) {
      const delta =
        elapsedTime +
        Math.floor((Date.now() - (startTime?.getTime() || 0)) / 1000);
      setElapsedTime(delta);
      setIsRunning(false);
    } else {
      setStartTime(new Date());
      setIsRunning(true);
    }
  };

  const handleStopAndMarkAsDone = async () => {
    setShouldBlink(false); // ⛔️ Отключаем мигание при завершении
    setIsRunning(false);
    const endTime = new Date();
    const duration = startTime
      ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000) +
        elapsedTime
      : elapsedTime;

    try {
      await todosService.saveTaskTime(
        task.id,
        startTime || endTime,
        endTime,
        duration
      );
      await todosService.taskIsDone(task.id, keycloak.token!);
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setIsTimerVisible(false);

      posthog.capture('task_completed', {
        taskId: task.id,
        description: task.description,
        category: task.category || 'Uncategorized',
        duration,
        isQuickTask: task.isQuickTask,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const mutationDelete = useMutation({
    mutationFn: (id: string) => todosService.deleteTodo(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });

  const mutationUpdate = useMutation({
    mutationFn: ({ id, description }: { id: string; description: string }) =>
      todosService.updateTodo(id, keycloak.token!, description, task.isDone),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setIsEdit(false);
    },
  });

  const handleQuickDone = async () => {
    setShouldBlink(false); // ⛔️ Отключаем мигание при быстром завершении
    try {
      await todosService.taskIsDone(task.id, keycloak.token!);
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className={`flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-lg shadow-md hover:shadow-lg transition-all w-full max-w-lg relative
      ${shouldBlink ? 'animate-pulse bg-red-100 dark:bg-red-900' : 'bg-white dark:bg-gray-800'}
    `}
    >
      <div className="flex-1 min-w-0">
        <TaskContent
          task={task}
          isEdit={isEdit}
          inputEdit={inputEdit}
          onChange={handleChangeInput}
          isTimerVisible={isTimerVisible && !task.isQuickTask}
          time={time}
          isAlarmTriggered={shouldBlink}
        />
      </div>

      <div className="mt-4 md:mt-0 md:ml-4 flex-shrink-0 flex flex-wrap justify-center md:justify-end gap-2 z-10">
        <TaskActions
          isQuickTask={task.isQuickTask ?? false}
          isEdit={isEdit}
          isTimerVisible={isTimerVisible}
          isRunning={isRunning}
          onSave={handleSave}
          onCancel={handleCancel}
          onEdit={handleEdit}
          onStartOrReset={handleStartOrReset}
          onPauseOrResume={handlePauseOrResume}
          onDone={task.isQuickTask ? handleQuickDone : handleStopAndMarkAsDone}
          onDelete={() => mutationDelete.mutate(task.id)}
          isDone={task.isDone}
        />
      </div>
    </div>
  );
};

export default TaskDeck;
