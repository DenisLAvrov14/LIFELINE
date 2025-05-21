import { Request, Response } from "express";
import pool from "../services/db.connection";

// Получение всех задач (Todos)
export const getTodos = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId as string;
    console.log("🔍 [getTodos] Запрос задач для userId:", userId);

    if (!userId) {
      console.error("❌ [getTodos] Ошибка: userId отсутствует в запросе");
      return res
        .status(400)
        .json({ error: "User ID is missing in request token" });
    }

    console.log("🛠 getTodos was called");

    const result = await pool.query<{
      id: string;
      user_id: string;
      description: string;
      isDone: boolean;
      created_at: Date;
      folder_id: string | null;
      has_timer: boolean;
      alarm_time: Date | null;
      is_quick_task: boolean;
    }>(
      `
SELECT
  id,
  user_id,
  description,
  "isDone",
  created_at   AS "createdAt",
  folder_id    AS "folderId",
  has_timer    AS "hasTimer",
  alarm_time   AS "alarmTime",
  is_quick_task AS "isQuickTask",
  category                      -- 👈 добавили
FROM tasks
WHERE user_id = $1
ORDER BY created_at DESC

      `,
      [userId],
    );

    console.log("✅ [getTodos] Найдено задач:", result.rowCount);

    // Отдаём клиенту уже готовый camelCase JSON
    res.json(result.rows);
  } catch (error: any) {
    console.error("❌ [getTodos] Ошибка при получении задач:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Обновление задачи (Todo)
export const updateTodo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { description, isDone } = req.body; // Используем isDone

  console.log(
    "Updating todo with ID:",
    id,
    "Description:",
    description,
    "Is Done:",
    isDone,
  );

  try {
    const result = await pool.query(
      `UPDATE tasks 
       SET description = $1, "isDone" = $2 
       WHERE id = $3 
       RETURNING id, description, "isDone" AS "isDone", created_at AS "createdAt"`,
      [description, isDone, id],
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
