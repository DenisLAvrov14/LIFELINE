import { Request, Response } from "express";
import pool from "../services/db.connection";

// Получение всех задач (Todos)
export const getTodos = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, description, "isDone", created_at AS "createdAt" FROM tasks`
    );
    res.json(result.rows);
  } catch (error: any) {
    console.error("Error fetching todos:", error.message);
    res.status(500).send("Error fetching todos: " + error.message);
  }
};

// Создание новой задачи (Todo)
export const createTodo = async (req: Request, res: Response) => {
  const { description, isDone = false } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO tasks (description, "isDone") 
       VALUES ($1, $2) 
       RETURNING id, description, "isDone", created_at AS "createdAt"`,
      [description, isDone]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error("Error creating todo:", error.message);
    res.status(500).send("Error creating todo: " + error.message);
  }
};

// Обновление задачи (Todo)
export const updateTodo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { description, isDone } = req.body; // Используем isDone

  console.log("Updating todo with ID:", id, "Description:", description, "Is Done:", isDone);

  try {
    const result = await pool.query(
      `UPDATE tasks 
       SET description = $1, "isDone" = $2 
       WHERE id = $3 
       RETURNING id, description, "isDone" AS "isDone", created_at AS "createdAt"`,
      [description, isDone, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    console.log("Update result:", result.rows[0]);
    res.status(200).json(result.rows[0]);
  } catch (error: any) {
    console.error("Error updating todo:", error.message);
    res.status(500).send(error.message);
  }
};

// Удаление задачи (Todo)
export const deleteTodo = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    res.sendStatus(204);
  } catch (error: any) {
    console.error("Error deleting todo:", error.message);
    res.status(500).send("Error deleting todo: " + error.message);
  }
};
