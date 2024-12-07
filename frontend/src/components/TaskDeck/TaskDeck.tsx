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
    BiTimer
} from "react-icons/bi";
import styles from "./TaskDeck.module.css";
import { Task } from "../../models/Task";
import { useDispatch } from "react-redux";
import { TaskInput } from "../../components/TaskInput/TaskInput";
import { IconButton } from "../../components/IconButton/IconButton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import todosService from "../../services/todos.service";

type Props = {
    task: Task;
};

const TaskDeck: React.FC<Props> = (props) => {
    const { task } = props;
    const dispatch = useDispatch();
    const userId = "00000000-0000-0000-0000-000000000001";

    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [inputEdit, setInputEdit] = useState<string>(task.description);
    const [isTimerVisible, setIsTimerVisible] = useState<boolean>(false);
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [timerStarted, setTimerStarted] = useState<boolean>(false);
    const [cursorPointer, setCursorPointer] = useState<boolean>(false);
    const [startTime, setStartTime] = useState<Date | null>(null);

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
            alert("Task was deleted");
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    const mutationSaveTime = useMutation({
        mutationFn: async ({ taskId, userId, startTime, endTime, duration }: 
          { taskId: string, userId: string, startTime: Date, endTime: Date, duration: number }) => {
            return await todosService.saveTaskTime(taskId, userId, startTime, endTime, duration);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    const onDeleteTask = useCallback(async () => {
        await mutationDelete.mutate(taskId);
    }, [mutationDelete, taskId]);

    const mutationUpdateTask = useMutation({
        mutationFn: async ({ id, description }: { id: string, description: string }) => {
            const result = await todosService.updateTodo(id, description, task.isDone);
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
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

    const handleStartTimer = useCallback(
        async () => {
            try {
                const now = new Date();
    
                console.log("Starting timer for task:", { taskId, now });
    
                const response = await todosService.startTimer(taskId, now);
    
                console.log("Server response:", response);
    
                if (response.success) {
                    // Если сервер подтвердил запуск таймера
                    setIsTimerVisible(true);
                    setTimerStarted(true);
                    setCursorPointer(true);
                    setStartTime(now);
                    setIsRunning(true);
                    setTime(0);
                    console.log("Timer started for task:", taskId);
                } else {
                    throw new Error(response.message || "Failed to start timer on the server.");
                }
            } catch (error) {
                console.error("Error starting timer:", error);
                alert("Failed to start timer. Please try again.");
            }
        },
        [taskId]
    );    
    
    const saveTime = (taskId: string, startTime: Date, endTime: Date, duration: number) => {
        mutationSaveTime.mutate({ taskId, userId, startTime, endTime, duration });
    };
          
    const handleStopAndMarkAsDone = async () => {
        try {
            setIsRunning(false);
            const endTime = new Date();
            const duration = startTime
                ? Math.round((endTime.getTime() - startTime.getTime()) / 1000)
                : 0;
    
            // Сохраняем время выполнения задачи
            if (startTime) {
                await todosService.saveTaskTime(taskId, userId, startTime, endTime, duration);
            }
    
            // Обновляем статус задачи
            await todosService.taskIsDone(taskId);
    
            // Инвалидируем кэш, чтобы обновить данные
            queryClient.invalidateQueries({ queryKey: ["todos"] });
    
            alert("Task has been marked as done successfully!");
        } catch (error) {
            console.error("Error stopping and marking task as done:", error);
            alert("Failed to stop timer and mark task as done. Please try again.");
        }
    };
   
    const handleReset = () => {
        setIsTimerVisible(false);
        setIsRunning(false);
        const endTime = new Date();
        if (startTime) {
            const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
            saveTime(taskId, startTime, endTime, duration);
        }
        setTime(0);
    };

    const handlePlayPause = () => {
        setIsRunning((prev) => !prev);
    };

    useEffect(() => {
        const fetchTimerStatus = async () => {
            try {
                const response = await todosService.getTimerStatus(taskId);
                if (response?.start_time && response?.is_running) {
                    setStartTime(new Date(response.start_time));
                    setIsRunning(response.is_running);
                    setTimerStarted(response.is_running);
                    setIsTimerVisible(response.is_running);
                    const elapsedTime = (Date.now() - new Date(response.start_time).getTime()) / 1000;
                    setTime(elapsedTime);
                }
            } catch (error) {
                console.error("Error fetching timer status:", error);
            }
        };
        fetchTimerStatus();
    }, [taskId]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning) {
            interval = setInterval(async () => {
                const elapsed = (Date.now() - (startTime?.getTime() || Date.now())) / 1000;
                setTime(elapsed);
                try {
                    await todosService.updateTimer(taskId, elapsed, isRunning);
                } catch (error) {
                    console.error("Error updating timer:", error);
                }
            }, 1000); 
        }
        return () => clearInterval(interval);
    }, [isRunning, startTime, taskId]);

    const toggleTimerVisibility = () => {
        if (timerStarted) {
            setIsTimerVisible(!isTimerVisible);
        }
    };

    const renderButtons = () => {
        if (isTimerVisible) {
            return (
                <>
                    <IconButton onClick={handlePlayPause}>
                        {isRunning ? <BiPause title="Pause" /> : <BiPlay title="Play" />}
                    </IconButton>
                    <IconButton onClick={handleStopAndMarkAsDone}>
                        <BiCheck title="Stop and Mark as Done" />
                    </IconButton>
                    <IconButton onClick={handleReset}>
                        <BiReset title="Reset" />
                    </IconButton>
                </>
            );
        }

        if (isEdit) {
            return (
                <>
                    <IconButton onClick={handleSave}>
                        <BiTask title="Accept" />
                    </IconButton>
                    <IconButton onClick={handleCancel}>
                        <BiTaskX title="Undo" />
                    </IconButton>
                </>
            );
        }

        return (
            <>
                <IconButton onClick={handleStartTimer}>
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
            <li className={`${styles.taskContainer} ${cursorPointer ? styles.cursorPointer : ''}`} onClick={toggleTimerVisibility}>
                <div className={styles.taskContent}>
                    {!isEdit && !isTimerVisible && task.description}
                    {isEdit && (
                        <TaskInput autoFocus value={inputEdit} onChange={handleChangeInput} />
                    )}
                    {isTimerVisible && (
                        <div className={styles.timerContainer}>
                            <p className={styles.timerDisplay}>{new Date(time * 1000).toISOString().substr(11, 8)}</p>
                        </div>
                    )}
                </div>
            </li>
            <div className={styles.buttons}>{renderButtons()}</div>
        </div>
    );
};

export default TaskDeck;

