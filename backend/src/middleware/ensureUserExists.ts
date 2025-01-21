import { Request, Response, NextFunction } from "express";
import pool from "../services/db.connection";

export const ensureUserExists = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = (req as any).userId;
    const tokenPayload = (req as any).keycloakToken;
  
    if (!userId || !tokenPayload) {
      console.error("User ID or token payload is missing");
      return res.status(401).json({ error: "Unauthorized: Token payload is missing" });
    }
  
    const preferredUsername = tokenPayload.preferred_username || "Unknown";
    const email = tokenPayload.email || "unknown@example.com";
  
    try {
      const query = `SELECT id FROM users WHERE id = $1`;
      const result = await pool.query(query, [userId]);
  
      if (result.rowCount === 0) {
        const insertQuery = `
          INSERT INTO users (id, username, email)
          VALUES ($1, $2, $3)
        `;
        await pool.query(insertQuery, [userId, preferredUsername, email]);
        console.log(`New user added: ${preferredUsername}`);
      } else {
        console.log(`User already exists: ${userId}`);
      }
  
      next();
    } catch (error) {
      console.error("Error checking or adding user:", (error as Error).message);
      return res.status(500).json({ error: "Internal server error" });
    }
  };  