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
          task_id,
          description,
          COUNT(task_id) AS task_count,
          SUM(total_time) AS total_time,
          MAX(completed_at) AS last_completed_at
      FROM 
          completed_tasks
      WHERE 
          user_id = $1::uuid AND
          completed_at >= date_trunc('week', now())
      GROUP BY 
          task_id, description
      ORDER BY 
          last_completed_at DESC;
    `;

    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No completed tasks found for this user this week" });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
