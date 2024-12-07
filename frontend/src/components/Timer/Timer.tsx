import React, { useState, useEffect } from 'react';
import styles from './Timer.module.css';
import { TimerProps } from '../../models/Timer';
import todosService from '../../services/todos.service';

const Timer: React.FC<TimerProps> = ({ taskId, onSaveTime }) => {
    const [time, setTime] = useState(0); // Время в секундах
    const [isRunning, setIsRunning] = useState(false); // Состояние таймера (запущен/остановлен)
    const [startTime, setStartTime] = useState<Date | null>(null); // Время начала таймера

    // Обновление времени при запуске таймера
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning) {
            interval = setInterval(() => {
                setTime(prevTime => prevTime + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    // Запуск таймера
    const handlePlayPause = async () => {
        if (!isRunning) {
            const now = new Date();
            setStartTime(now); // Сохраняем время начала
            try {
                // Отправляем запрос на запуск таймера
                await todosService.startTimer(taskId, now);
                setIsRunning(true);
            } catch (error) {
                console.error('Error starting timer:', error);
            }
        } else {
            setIsRunning(false); // Остановка таймера без сохранения
        }
    };

    // Сохранение времени при остановке таймера
    const handleStop = async () => {
        setIsRunning(false);
        const endTime = new Date();
        if (startTime) {
            const duration = time; // Используем текущее значение времени
            try {
                // Отправляем запрос на сохранение времени
                await todosService.saveTaskTime(taskId, "00000000-0000-0000-0000-000000000001", startTime, endTime, duration);
                onSaveTime(taskId, duration); // Вызываем callback для обновления состояния
            } catch (error) {
                console.error('Error saving task time:', error);
            }
        }
        setStartTime(null); // Сбрасываем время начала
    };

    // Сброс таймера
    const handleReset = () => {
        setTime(0);
        setIsRunning(false);
        setStartTime(null);
    };

    return (
        <div className={styles.timerContainer}>
            <p className={styles.timerDisplay}>
                {new Date(time * 1000).toISOString().substr(11, 8)}
            </p>
            <div className={styles.timerButtons}>
                <button className={styles.timerButton} onClick={handlePlayPause}>
                    {isRunning ? 'Pause' : 'Play'}
                </button>
                <button className={styles.timerButton} onClick={handleStop}>Stop</button>
                <button className={styles.timerButton} onClick={handleReset}>Reset</button>
            </div>
        </div>
    );
};

export default Timer;
