import React, { useState, useEffect } from "react";
import styles from "./Timer.module.css";
import { TimerProps } from "../../models/Timer";
import todosService from "../../services/todos.service";

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
                const totalElapsed = Math.floor((currentTime - startTime) / 1000) + elapsedTime;
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
            console.log("[START TIMER] Sending start request to server...");
            await todosService.resumeTimer(taskId, time);
            console.log("[START TIMER] Timer started successfully");
        } catch (error) {
            console.error("Error starting timer:", error);
        }
    };

    // Обработчик для паузы таймера
    const handlePause = async () => {
        const currentElapsed = Math.floor((Date.now() - startTime!) / 1000) + time;
        setIsRunning(false);
        setElapsedTime(currentElapsed);

        try {
            console.log("[PAUSE TIMER] Sending pause request to server...");
            await todosService.pauseTimer(taskId, currentElapsed);
            console.log("[PAUSE TIMER] Timer paused successfully");
        } catch (error) {
            console.error("Error pausing timer:", error);
        }
    };

    // Остановка таймера и сохранение времени
    const handleStop = async () => {
        setIsRunning(false);
        const endTime = Date.now();
        const duration = Math.floor((endTime - startTime!) / 1000) + elapsedTime;

        try {
            console.log("[STOP TIMER] Saving task time to server...");
            await todosService.updateTaskTime(
                "generated-task-time-id",
                taskId,
                "00000000-0000-0000-0000-000000000001",
                new Date(startTime!),
                new Date(endTime),
                duration
            );
            onSaveTime(taskId, duration);
            console.log("[STOP TIMER] Task time saved successfully");
        } catch (error) {
            console.error("Error saving task time:", error);
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
        <div className={styles.timerContainer}>
            <p className={styles.timerDisplay}>
                {new Date(time * 1000).toISOString().substr(11, 8)} {/* Отображение в формате HH:MM:SS */}
            </p>
            <div className={styles.timerButtons}>
                <button className={styles.timerButton} onClick={handleStart}>
                    Start
                </button>
                <button className={styles.timerButton} onClick={handlePause} disabled={!isRunning}>
                    Pause
                </button>
                <button className={styles.timerButton} onClick={handleStop}>
                    Stop
                </button>
                <button className={styles.timerButton} onClick={handleReset}>
                    Reset
                </button>
            </div>
        </div>
    );
};

export default Timer;
