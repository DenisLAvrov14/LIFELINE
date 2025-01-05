import { Request, Response } from "express";
import pool from "../services/db.connection";

export const getWeeklyStats = async (req: Request, res: Response) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    console.log("Fetching weekly stats for user:", userId);

    const query = `
            SELECT 
                t.task_id,
                tasks.description,
                SUM(t.duration) AS total_time,
                COUNT(t.id) AS task_count
            FROM 
                task_times t
            JOIN 
                tasks ON t.task_id = tasks.id
            WHERE 
                t.user_id = $1 AND
                t.start_time >= date_trunc('week', now())
            GROUP BY 
                t.task_id, tasks.description
        `;

    const result = await pool.query(query, [userId]);
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No tasks found for this user this week" });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
