import { Router, Request, Response } from "express";
import pool from "../services/db.connection";

export interface User {
  id?: string; // UUID
  username: string;
  email: string;
}

const router = Router();

const createUser = async (req: Request, res: Response): Promise<void> => {
  const { username, email } = req.body;

  if (!username || !email) {
    res.status(400).send("Invalid data: Missing required fields");
    return;
  }

  const query = `
    INSERT INTO users (username, email)
    VALUES ($1, $2)
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, [username, email]);
    const createdUser = result.rows[0]; // Получаем созданного пользователя с UUID
    res.status(201).json(createdUser);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).send("Error creating user");
  }
};

router.post("/users", createUser);

export default router;
