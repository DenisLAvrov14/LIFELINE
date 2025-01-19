import { Request, Response } from "express";
import pool from "../services/db.connection";

export const getFilteredStats = async (req: Request, res: Response) => {
  try {
    // userId передаётся через middleware authenticateToken
    const userId = (req as any).userId;

    if (!userId) {
      return res
        .status(400)
        .json({ error: 'User ID is missing in request token' });
    }

    console.log(`Fetching stats for user: ${userId}`);

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

    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(200).json({
        message: 'No completed tasks found for the specified user',
        data: [],
      });
    }

    return res.status(200).json(result.rows);
  } catch (error: any) {
    console.error('Error fetching stats:', error.message);

    if (error.code) {
      console.error('Database error code:', error.code);
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
};