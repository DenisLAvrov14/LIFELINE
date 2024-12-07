import pool from "../services/db.connection";

// Создание записи времени задачи
export const createTaskTime = async (taskTime: {
  task_id: number;
  user_id: number;
  start_time: string;
  end_time: string | null;
  duration: number;
}) => {
  const { task_id, user_id, start_time, end_time, duration } = taskTime;

  const query = `
    INSERT INTO task_times (task_id, user_id, start_time, end_time, duration)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const values = [task_id, user_id, start_time, end_time, duration];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Обновление записи времени задачи
export const updateTaskTime = async (taskTime: {
  id: number;
  task_id: number;
  user_id: number;
  start_time: string;
  end_time: string;
  duration: number;
}) => {
  const { id, task_id, user_id, start_time, end_time, duration } = taskTime;

  const query = `
    UPDATE task_times 
    SET task_id = $1, user_id = $2, start_time = $3, end_time = $4, duration = $5
    WHERE id = $6
    RETURNING *;
  `;

  const values = [task_id, user_id, start_time, end_time, duration, id];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Получение всех записей времени для определенного пользователя
export const getTaskTimes = async (user_id: number) => {
  const query = `
    SELECT * 
    FROM task_times 
    WHERE user_id = $1;
  `;

  const values = [user_id];

  const { rows } = await pool.query(query, values);
  return rows;
};
