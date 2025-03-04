import { Request, Response, NextFunction } from "express";
import pool from "../services/db.connection";

export const ensureUserExists = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = (req as any).userId;
  const tokenPayload = (req as any).keycloakToken;

  if (!userId || !tokenPayload) {
    console.error(
      "❌ [ensureUserExists] Ошибка: User ID или токен отсутствуют",
    );
    return res
      .status(401)
      .json({ error: "Unauthorized: Token payload is missing" });
  }

  const preferredUsername = tokenPayload.preferred_username || "Unknown";
  const email = tokenPayload.email || "unknown@example.com";

  try {
    // 🔍 Проверяем сначала ID
    const queryById = `SELECT id FROM users WHERE id = $1`;
    const resultById = await pool.query(queryById, [userId]);

    if ((resultById.rowCount ?? 0) > 0) {
      console.log(`🟢 [ensureUserExists] Пользователь найден по ID: ${userId}`);
      return next(); // Пользователь уже есть, продолжаем
    }

    // 🔍 Проверяем email (вдруг ID разный, но email совпадает)
    const queryByEmail = `SELECT id FROM users WHERE email = $1`;
    const resultByEmail = await pool.query(queryByEmail, [email]);

    if ((resultByEmail.rowCount ?? 0) > 0) {
      console.log(
        `🟢 [ensureUserExists] Пользователь найден по email: ${email}`,
      );
      return next(); // Email уже есть, продолжаем
    }

    // 🔄 Если пользователь не найден — создаем его
    console.log(
      `🟡 [ensureUserExists] Добавляем нового пользователя: ${preferredUsername} (${email})`,
    );
    const insertQuery = `
            INSERT INTO users (id, username, email)
            VALUES ($1, $2, $3)
        `;
    await pool.query(insertQuery, [userId, preferredUsername, email]);
    console.log(
      `✅ [ensureUserExists] Новый пользователь добавлен: ${preferredUsername}`,
    );

    next();
  } catch (error: any) {
    console.error(
      "❌ [ensureUserExists] Ошибка при проверке или добавлении пользователя:",
      error.message,
    );
    return res.status(500).json({ error: error.message });
  }
};
