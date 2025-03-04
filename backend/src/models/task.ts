import pool from "../services/db.connection";

export interface Task {
  id?: string; // UUID
  user_id: string;
  description: string;
  is_done: boolean;
  created_at?: Date;
  has_timer: boolean;
  alarm_time: Date | null;
}

// Создание задачи
export const createTask = async (task: Task): Promise<Task> => {
  const query = `
    INSERT INTO tasks (user_id, description, is_done, has_timer, alarm_time)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const values = [
    task.user_id,
    task.description,
    task.is_done,
    task.has_timer,
    task.alarm_time,
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error("Error creating task:", err);
    throw err;
  }
};

// Обновление задачи
export const updateTask = async (task: Task): Promise<Task> => {
  const query = `
    UPDATE tasks
    SET description = $1, is_done = $2, has_timer = $3, alarm_time = $4
    WHERE id = $5 AND user_id = $6
    RETURNING *;
  `;

  const values = [
    task.description,
    task.is_done,
    task.has_timer,
    task.alarm_time,
    task.id,
    task.user_id,
  ];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error("Error updating task:", err);
    throw err;
  }
};

// Получение всех задач пользователя
export const getTasksByUser = async (user_id: string): Promise<Task[]> => {
  const query = `
    SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC;
  `;

  try {
    const result = await pool.query(query, [user_id]);
    return result.rows;
  } catch (err) {
    console.error("Error fetching tasks:", err);
    throw err;
  }
};

// Удаление задачи
export const deleteTask = async (
  task_id: string,
  user_id: string,
): Promise<void> => {
  const query = `
    DELETE FROM tasks WHERE id = $1 AND user_id = $2;
  `;

  try {
    await pool.query(query, [task_id, user_id]);
  } catch (err) {
    console.error("Error deleting task:", err);
    throw err;
  }
};
