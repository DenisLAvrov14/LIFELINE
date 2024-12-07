import { Request, Response } from "express";
import pool from "../services/db.connection";

// Получение всех задач (Todos)
export const getTodos = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM tasks");
    res.json(result.rows);
  } catch (error: any) {
    console.error("Error fetching todos:", error.message);
    res.status(500).send(error.message);
  }
};

// Создание новой задачи (Todo)
export const createTodo = async (req: Request, res: Response) => {
  const { description, is_done = false } = req.body; // Устанавливаем значение по умолчанию для is_done

  try {
    const result = await pool.query(
      `INSERT INTO tasks (description, is_done) 
       VALUES ($1, $2) 
       RETURNING id, description, is_done AS "isDone", created_at AS "createdAt"`,
      [description, is_done]
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error("Error creating todo:", error.message);
    res.status(500).send(error.message);
  }
};

// Обновление задачи (Todo)
export const updateTodo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { description, is_done } = req.body;

  console.log("Updating todo with ID:", id, "Description:", description, "Is Done:", is_done);

  try {
    const result = await pool.query(
      `UPDATE tasks 
       SET description = $1, is_done = $2 
       WHERE id = $3 
       RETURNING id, description, is_done AS "isDone", created_at AS "createdAt"`,
      [description, is_done, id]
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
    res.status(500).send(error.message);
  }
};
