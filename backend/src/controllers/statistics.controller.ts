import { Request, Response } from 'express';
import pool from "../services/db.connection";

// Получение статистики задач пользователя за неделю
export const getWeeklyStats = async (req: Request, res: Response) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
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
                t.start_time >= date_trunc('week', now()) -- С начала текущей недели
            GROUP BY 
                t.task_id, tasks.description
        `;

        const result = await pool.query(query, [userId]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching stats:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

