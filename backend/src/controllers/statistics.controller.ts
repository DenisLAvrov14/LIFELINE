import { Request, Response } from "express";
import pool from "../services/db.connection";

export const getFilteredStats = async (req: Request, res: Response) => {
  try {
    // Извлечение параметров запроса
    const { userId } = req.query;

    // Проверяем наличие параметра userId
    if (!userId) {
      return res.status(400).json({
        error: "User ID is required",
      });
    }

    console.log(`Fetching stats for user: ${userId}`);

    // SQL-запрос (убран временной диапазон)
    const query = `
      SELECT 
          description,
          COUNT(*) AS task_count,
          SUM(total_time) AS total_time,
          MAX(completed_at) AS last_completed_at
      FROM 
          completed_tasks
      WHERE 
          user_id = $1::uuid
      GROUP BY 
          description
      ORDER BY 
          last_completed_at DESC;

    `;

    // Выполнение запроса
    const result = await pool.query(query, [userId]);

    // Проверяем, есть ли записи в результате
    if (result.rows.length === 0) {
      return res.status(200).json({
        message: "No completed tasks found for the specified user",
        data: [],
      });
    }

    // Возвращаем результат
    return res.status(200).json(result.rows);
  } catch (error: any) {
    console.error("Error fetching stats:", error.message);

    // Более подробная информация об ошибке базы данных
    if (error.code) {
      console.error("Database error code:", error.code);
    }

    // Возвращаем ошибку сервера
    return res.status(500).json({ error: "Internal server error" });
  }
};
