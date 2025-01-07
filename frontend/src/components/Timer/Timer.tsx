import React, { useState, useEffect } from 'react';
import { TimerProps } from '../../models/Timer';
import todosService from '../../services/todos.service';

const Timer: React.FC<TimerProps> = ({ taskId, onSaveTime }) => {
  const [time, setTime] = useState(0); // Накопленное время в секундах
  const [isRunning, setIsRunning] = useState(false); // Состояние таймера
  const [startTime, setStartTime] = useState<number | null>(null); // Время старта
  const [elapsedTime, setElapsedTime] = useState(0); // Время до паузы

  // Обновление времени при запуске таймера
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && startTime !== null) {
      interval = setInterval(() => {
        const currentTime = Date.now();
        const totalElapsed =
          Math.floor((currentTime - startTime) / 1000) + elapsedTime;
        setTime(totalElapsed); // Обновляем новое время
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, startTime, elapsedTime]);

  // Обработчик для старта таймера
  const handleStart = async () => {
    const now = Date.now();
    setStartTime(now);
    setIsRunning(true);

    try {
      console.log('[START TIMER] Sending start request to server...');
      await todosService.resumeTimer(taskId, time);
      console.log('[START TIMER] Timer started successfully');
    } catch (error) {
      console.error('Error starting timer:', error);
    }
  };

  // Обработчик для паузы таймера
  const handlePause = async () => {
    const currentElapsed = Math.floor((Date.now() - startTime!) / 1000) + time;
    setIsRunning(false);
    setElapsedTime(currentElapsed);

    try {
      console.log('[PAUSE TIMER] Sending pause request to server...');
      await todosService.pauseTimer(taskId, currentElapsed);
      console.log('[PAUSE TIMER] Timer paused successfully');
    } catch (error) {
      console.error('Error pausing timer:', error);
    }
  };

  // Остановка таймера и сохранение времени
  const handleStop = async () => {
    setIsRunning(false);
    const endTime = Date.now();
    const duration = Math.floor((endTime - startTime!) / 1000) + elapsedTime;

    try {
      console.log('[STOP TIMER] Saving task time to server...');
      await todosService.updateTaskTime(
        'generated-task-time-id',
        taskId,
        '00000000-0000-0000-0000-000000000001',
        new Date(startTime!),
        new Date(endTime),
        duration
      );
      onSaveTime(taskId, duration);
      console.log('[STOP TIMER] Task time saved successfully');
    } catch (error) {
      console.error('Error saving task time:', error);
    }

    setTime(0);
    setElapsedTime(0);
    setStartTime(null);
  };

  // Сброс таймера
  const handleReset = () => {
    setTime(0);
    setElapsedTime(0);
    setIsRunning(false);
    setStartTime(null);
  };

  return (
    <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-md w-full max-w-md mx-auto">
      {/* Дисплей таймера */}
      <p className="text-3xl font-mono text-gray-800 dark:text-gray-200 mb-4">
        {new Date(time * 1000).toISOString().substr(11, 8)}
      </p>

      {/* Кнопки управления таймером */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300 transition"
          onClick={handleStart}
        >
          Start
        </button>
        <button
          className={`px-4 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 focus:outline-none focus:ring focus:ring-yellow-300 transition ${
            !isRunning ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handlePause}
          disabled={!isRunning}
        >
          Pause
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300 transition"
          onClick={handleStop}
        >
          Stop
        </button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300 transition"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Timer;
