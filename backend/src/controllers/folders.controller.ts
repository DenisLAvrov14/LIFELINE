import { Request, Response } from "express";
import pool from "../services/db.connection";

// Получить все папки пользователя
export const getFolders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const result = await pool.query(
      `SELECT id, name, created_at FROM folders WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId],
    );
    res.json(result.rows);
  } catch (error: any) {
    console.error("Error fetching folders:", error.message);
    res.status(500).json({ error: "Error fetching folders" });
  }
};

// Создать новую папку
export const createFolder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Folder name is required" });
    }

    const result = await pool.query(
      `INSERT INTO folders (user_id, name) VALUES ($1, $2) RETURNING *`,
      [userId, name],
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error("Error creating folder:", error.message);
    res.status(500).json({ error: "Error creating folder" });
  }
};

// Переименовать папку
export const renameFolder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const folderId = req.params.id;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Folder name is required" });
    }

    const result = await pool.query(
      `UPDATE folders SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *`,
      [name, folderId, userId],
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Folder not found or not authorized" });
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    console.error("Error renaming folder:", error.message);
    res.status(500).json({ error: "Error renaming folder" });
  }
};

// Удалить папку
export const deleteFolder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const folderId = req.params.id;

    const result = await pool.query(
      `DELETE FROM folders WHERE id = $1 AND user_id = $2 RETURNING *`,
      [folderId, userId],
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Folder not found or not authorized" });
    }

    res.json({ message: "Folder deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting folder:", error.message);
    res.status(500).json({ error: "Error deleting folder" });
  }
};
