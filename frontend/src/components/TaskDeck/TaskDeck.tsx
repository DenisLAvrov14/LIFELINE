import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
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
} from 'react-icons/bi';
import styles from './TaskDeck.module.css';
import { Task } from '../../models/Task';
import { TaskInput } from '../../components/TaskInput/TaskInput';
import { IconButton } from '../../components/IconButton/IconButton';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import todosService from '../../services/todos.service';

type Props = {
  task: Task;
};

const TaskDeck: React.FC<Props> = (props) => {
  const { task } = props;
  const userId = '00000000-0000-0000-0000-000000000001';

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [inputEdit, setInputEdit] = useState<string>(task.description);
  const [isTimerVisible, setIsTimerVisible] = useState<boolean>(false);
  const [time, setTime] = useState(0); // Время в секундах
  const [isRunning, setIsRunning] = useState(false); // Статус таймера
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0); // Время до паузы
  const [cursorPointer, setCursorPointer] = useState<boolean>(false);

  const handleEdit = useCallback(() => {
    setIsEdit((prev) => !prev);
  }, []);

  const taskId = task.id;
  const queryClient = useQueryClient();

  const mutationDelete = useMutation({
    mutationFn: async (taskId: string) => {
      const result = await todosService.deleteTodo(taskId);
      return result;
    },
    onSuccess: () => {
      console.log('[DELETE TASK] Task deleted:', taskId);
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const onDeleteTask = useCallback(async () => {
    console.log('[DELETE TASK] Deleting task:', taskId);
    await mutationDelete.mutate(taskId);
  }, [mutationDelete, taskId]);

  const mutationUpdateTask = useMutation({
    mutationFn: async ({
      id,
      description,
    }: {
      id: string;
      description: string;
    }) => {
      console.log('[UPDATE TASK] Updating task:', id, description);
      const result = await todosService.updateTodo(
        id,
        description,
        task.isDone
      );
      return result;
    },
    onSuccess: () => {
      console.log('[UPDATE TASK] Task updated successfully.');
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setIsEdit(false);
    },
  });

  const handleSave = useCallback(() => {
    mutationUpdateTask.mutate({ id: task.id, description: inputEdit });
  }, [inputEdit, mutationUpdateTask, task.id]);

  const handleCancel = useCallback(() => {
    setIsEdit(false);
  }, []);

  const handleChangeInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInputEdit(e.target.value);
  }, []);

  // Start/Reset button logic
  const handleStartOrReset = useCallback(async () => {
    if (isRunning || elapsedTime > 0) {
      // Reset logic
      setIsTimerVisible(false);
      setIsRunning(false);
      setElapsedTime(0);
      setStartTime(null);
      setTime(0);
      console.log('[RESET TIMER] Timer reset.');
    } else {
      // Start logic
      try {
        const now = new Date();
        const response = await todosService.startTimer(taskId, now);
        if (response.success) {
          setStartTime(now);
          setIsRunning(true);
          setElapsedTime(0);
          setIsTimerVisible(true);
          console.log('[START TIMER] Timer started successfully.');
        } else {
          throw new Error(response.message || 'Failed to start timer.');
        }
      } catch (error) {
        console.error('[START TIMER] Error starting timer:', error);
      }
    }
  }, [isRunning, elapsedTime, taskId]);

  // Pause/Resume button logic
  const handlePauseOrResume = useCallback(async () => {
    if (isRunning) {
      // Pause logic
      try {
        const currentElapsed =
          Math.floor((Date.now() - (startTime?.getTime() || 0)) / 1000) +
          elapsedTime;
        await todosService.pauseTimer(taskId, currentElapsed);
        setElapsedTime(currentElapsed);
        setIsRunning(false);
        console.log('[PAUSE TIMER] Timer paused successfully.');
      } catch (error) {
        console.error('[PAUSE TIMER] Error pausing timer:', error);
      }
    } else {
      // Resume logic
      try {
        const response = await todosService.resumeTimer(taskId, elapsedTime);
        if (response.success) {
          setStartTime(new Date());
          setIsRunning(true);
          console.log('[RESUME TIMER] Timer resumed successfully.');
        } else {
          throw new Error(response.message || 'Failed to resume timer.');
        }
      } catch (error) {
        console.error('[RESUME TIMER] Error resuming timer:', error);
      }
    }
  }, [isRunning, elapsedTime, startTime, taskId]);

  // Stop and mark task as done
  const handleStopAndMarkAsDone = async () => {
    try {
      setIsRunning(false);
      const endTime = new Date();
      const duration = startTime
        ? Math.round((endTime.getTime() - startTime.getTime()) / 1000) +
          elapsedTime
        : elapsedTime;

      console.log(
        '[STOP AND DONE] Stopping timer at:',
        endTime,
        'Duration:',
        duration
      );

      if (startTime) {
        await todosService.saveTaskTime(
          taskId,
          userId,
          startTime,
          endTime,
          duration
        );
      }

      await todosService.taskIsDone(taskId);

      queryClient.invalidateQueries({ queryKey: ['todos'] });

      console.log('[STOP AND DONE] Task marked as done.');
      // After marking as done, show the default buttons
      setIsTimerVisible(false);
    } catch (error) {
      console.error(
        '[STOP AND DONE] Error stopping timer and marking as done:',
        error
      );
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && startTime) {
      interval = setInterval(() => {
        const elapsed =
          Math.floor((Date.now() - startTime.getTime()) / 1000) + elapsedTime;
        setTime(elapsed);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime, elapsedTime]);

  useEffect(() => {
    if (isTimerVisible) {
      setCursorPointer(true);
    } else {
      setCursorPointer(false);
    }
  }, [isTimerVisible]);

  const renderButtons = () => {
    if (isTimerVisible) {
      return (
        <>
          <IconButton onClick={handleStartOrReset}>
            {isRunning || elapsedTime > 0 ? (
              <BiReset title="Reset" />
            ) : (
              <BiPlay title="Start" />
            )}
          </IconButton>
          <IconButton onClick={handlePauseOrResume}>
            {isRunning ? <BiPause title="Pause" /> : <BiPlay title="Resume" />}
          </IconButton>
          <IconButton onClick={handleStopAndMarkAsDone}>
            <BiCheck title="Stop and Mark as Done" />
          </IconButton>
        </>
      );
    }

    return (
      <>
        <IconButton onClick={handleStartOrReset}>
          <BiTimer title="Start" />
        </IconButton>
        <IconButton onClick={handleEdit}>
          <BiEditAlt title="Edit" />
        </IconButton>
        <IconButton onClick={onDeleteTask}>
          <BiSolidTrash title="Trash can" />
        </IconButton>
      </>
    );
  };

  return (
    <div className={styles.taskItem}>
      <div className={styles.taskDescription}>
        <li
          className={`${styles.taskContainer} ${isEdit ? styles.isEdit : ''} ${
            task.isDone ? styles.isDone : ''
          }`}
          onClick={() => !isEdit && setIsTimerVisible(!isTimerVisible)}
        >
          <div className={styles.taskContent}>
            {/* Render only one: editing input or task description/timer */}
            {isEdit ? (
              <TaskInput
                autoFocus
                value={inputEdit}
                onChange={handleChangeInput}
              />
            ) : isTimerVisible ? (
              // Timer Display Mode
              <div className={styles.timerContainer}>
                <p className={styles.timerDisplay}>
                  {String(Math.floor(time / 3600)).padStart(2, '0')}:
                  {String(Math.floor((time % 3600) / 60)).padStart(2, '0')}:
                  {String(time % 60).padStart(2, '0')}
                </p>
              </div>
            ) : (
              // Task Description Mode
              <div>{task.description}</div>
            )}
          </div>
        </li>
      </div>
      <div className={styles.buttons}>
        {isEdit ? (
          <div className={styles.editButton}>
            <IconButton onClick={handleSave}>
              <BiTask title="Accept" />
            </IconButton>
            <IconButton onClick={handleCancel}>
              <BiTaskX title="Undo" />
            </IconButton>
          </div>
        ) : (
          renderButtons()
        )}
      </div>
    </div>
  );
};

export default TaskDeck;
