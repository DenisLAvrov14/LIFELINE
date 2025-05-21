import { useEffect, useState } from 'react';

export const useTaskTimer = (taskId: string) => {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [time, setTime] = useState(0);
  const [isTimerVisible, setIsTimerVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`timerState-${taskId}`);
    if (saved) {
      const state = JSON.parse(saved);
      setIsRunning(state.isRunning);
      setStartTime(state.startTime ? new Date(state.startTime) : null);
      setElapsedTime(state.elapsedTime);
      setIsTimerVisible(state.isTimerVisible);
      setTime(state.time);
    }
  }, [taskId]);

  useEffect(() => {
    const state = {
      isRunning,
      startTime: startTime?.toISOString(),
      elapsedTime,
      isTimerVisible,
      time,
    };
    localStorage.setItem(`timerState-${taskId}`, JSON.stringify(state));
  }, [isRunning, startTime, elapsedTime, isTimerVisible, time, taskId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && startTime) {
      interval = setInterval(() => {
        setTime(
          elapsedTime + Math.floor((Date.now() - startTime.getTime()) / 1000)
        );
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime, elapsedTime]);

  return {
    isRunning,
    setIsRunning,
    startTime,
    setStartTime,
    elapsedTime,
    setElapsedTime,
    time,
    isTimerVisible,
    setIsTimerVisible,
  };
};
