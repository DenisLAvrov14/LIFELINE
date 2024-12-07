import { Request, Response } from "express";
import pool from "../services/db.connection";

// Получение всех задач
export const getTasks = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, description, "isDone", created_at AS "createdAt" FROM tasks`
    );
    res.json(result.rows);
  } catch (error: any) {
    console.error("Error fetching tasks:", error.message);
    res.status(500).send(error.message);
  }
};

// Создание новой задачи
export const createTask = async (req: Request, res: Response) => {
  const { description, isDone = false } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO tasks (description, "isDone") VALUES ($1, $2) RETURNING id, description, "isDone", created_at AS "createdAt"`,
      [description, isDone]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error("Error creating task:", error.message);
    res.status(500).send(error.message);
  }
};

// Обновление задачи
export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { description, isDone } = req.body;

  if (description === undefined || isDone === undefined) {
    return res
      .status(400)
      .json({ message: "Invalid data: description and isDone are required" });
  }

  console.log(`Updating task with ID: ${id}`);
  console.log(`New description: ${description}`);
  console.log(`New isDone status: ${isDone}`);

  try {
    const result = await pool.query(
      `UPDATE tasks SET description = $1, "isDone" = $2 WHERE id = $3 RETURNING id, description, "isDone", created_at AS "createdAt"`,
      [description, isDone, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    console.log(`Update result:`, result.rows[0]);
    res.status(200).json(result.rows[0]);
  } catch (error: any) {
    console.error("Error updating task:", error.message);
    res.status(500).send(error.message);
  }
};

// Удаление задачи
export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM tasks WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.sendStatus(204);
  } catch (error: any) {
    console.error("Error deleting task:", error.message);
    res.status(500).send(error.message);
  }
};

// Отметить задачу как выполненную
export const markTaskAsDone = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE tasks SET "isDone" = true WHERE id = $1 RETURNING id, description, "isDone", created_at AS "createdAt"`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res
      .status(200)
      .json({ message: "Task marked as done", task: result.rows[0] });
  } catch (error: any) {
    console.error("Error marking task as done:", error.message);
    res.status(500).send(`Error marking task as done: ${error.message}`);
  }
};
