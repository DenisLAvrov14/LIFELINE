import { Request, Response } from "express";
import {
  createTaskTime as createTaskTimeModel,
  updateTaskTime as updateTaskTimeModel,
  getTaskTimes as getTaskTimesModel,
} from "../models/task_times.model";
import pool from "../services/db.connection";

// Создание записи времени выполнения задачи
export const createTaskTimeController = async (req: Request, res: Response) => {
  const { task_id, user_id, start_time, end_time, duration } = req.body;

  console.log("Received data:", { task_id, user_id, start_time, end_time, duration });

  if (!task_id || !user_id || !start_time || (!duration && duration !== 0)) {
    return res.status(400).send("Invalid data: Missing required fields");
  }

  try {
    const startTimeFormatted = new Date(start_time).toISOString();
    const endTimeFormatted = end_time ? new Date(end_time).toISOString() : null;
    const roundedDuration = Math.round(duration);

    await createTaskTimeModel({
      task_id,
      user_id,
      start_time: startTimeFormatted,
      end_time: endTimeFormatted,
      duration: roundedDuration,
    });

    res.status(201).json({ message: "Task time created successfully" });
  } catch (error: any) {
    console.error("Error creating task time:", error.message);
    res.status(500).send(`Error creating task time: ${error.message}`);
  }
};

// Обновление записи времени выполнения задачи
export const updateTaskTimeController = async (req: Request, res: Response) => {
  const { id, task_id, user_id, start_time, end_time, duration } = req.body;

  try {
    const startTimeFormatted = new Date(start_time).toISOString();
    const endTimeFormatted = new Date(end_time).toISOString();

    await updateTaskTimeModel({
      id,
      task_id,
      user_id,
      start_time: startTimeFormatted,
      end_time: endTimeFormatted,
      duration,
    });

    res.status(200).json({ message: "Task time updated successfully" });
  } catch (error: any) {
    console.error("Error updating task time:", error.message);
    res.status(500).send(`Error updating task time: ${error.message}`);
  }
};

// Отметить задачу как выполненную
export const markTaskAsDone = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE tasks SET "isDone" = TRUE WHERE id = $1 RETURNING id, description, "isDone", created_at AS "createdAt"`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ success: true, task: result.rows[0] });
  } catch (error: any) {
    console.error("Error marking task as done:", error.message);
    res.status(500).json({ success: false, message: `Error marking task as done: ${error.message}` });
  }
};

// Удаление задачи и связанных с ней записей времени
export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM task_times WHERE task_id = $1", [id]);
    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    res.sendStatus(204);
  } catch (error: any) {
    console.error("Error deleting task:", error.message);
    res.status(500).send("Error deleting task");
  }
};

// Получение статуса таймера
export const getTimerStatus = async (req: Request, res: Response) => {
  const { taskId } = req.params;

  try {
    const { rows } = await pool.query(
      "SELECT * FROM task_times WHERE task_id = $1 ORDER BY start_time DESC LIMIT 1",
      [taskId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No timer found for this task" });
    }

    const timerStatus = rows[0];
    res.json({
      start_time: timerStatus.start_time,
      is_running: !timerStatus.end_time,
      duration: timerStatus.duration,
    });
  } catch (error: any) {
    console.error("Error fetching timer status:", error.message);
    res.status(500).send(`Error fetching timer status: ${error.message}`);
  }
};

// Запуск таймера
export const startTimerController = async (req: Request, res: Response) => {
  const { task_id, user_id, start_time } = req.body;

  if (!task_id || !user_id || !start_time) {
    return res.status(400).json({
      success: false,
      message: "Invalid data: Missing required fields",
    });
  }

  try {
    const startTimeFormatted = new Date(start_time).toISOString();

    await createTaskTimeModel({
      task_id,
      user_id,
      start_time: startTimeFormatted,
      end_time: null,
      duration: 0,
    });

    res.status(201).json({
      success: true,
      message: "Timer started successfully",
      data: {
        task_id,
        user_id,
        start_time: startTimeFormatted,
      },
    });
  } catch (error: any) {
    console.error("Error starting timer:", error.message);

    res.status(500).json({
      success: false,
      message: "Error starting timer",
      error: error.message,
    });
  }
};

// Обновление таймера
export const updateTimerController = async (req: Request, res: Response) => {
  const { task_id, elapsed_time, is_running } = req.body;

  if (!task_id || elapsed_time === undefined || is_running === undefined) {
    return res.status(400).send("Invalid data: Missing required fields");
  }

  try {
    const endTime = is_running ? null : new Date().toISOString();
    const roundedElapsedTime = Math.round(elapsed_time);
    await pool.query(
      `UPDATE task_times SET duration = $1, end_time = $2 WHERE task_id = $3 AND end_time IS NULL`,
      [roundedElapsedTime, endTime, task_id]
    );

    res.status(200).json({ message: "Timer updated successfully" });
  } catch (error: any) {
    console.error("Error updating timer:", error.message);
    res.status(500).send(`Error updating timer: ${error.message}`);
  }
};
