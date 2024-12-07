import pool from "../services/db.connection";

export interface User {
  id?: string; // UUID 
  username: string;
  email: string;
}

// Создание пользователя
export const createUser = async (newUser: User): Promise<User> => {
  const query = `
    INSERT INTO users (username, email)
    VALUES ($1, $2)
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, [newUser.username, newUser.email]);
    return result.rows[0]; // Возвращаем созданного пользователя, включая UUID
  } catch (err) {
    console.error("Error creating user:", err);
    throw err;
  }
};
