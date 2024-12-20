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
  end_time: string | null;
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

export const updateTaskTimeModel = async (taskTime: {
  id: number;
  task_id: number;
  user_id: number;
  start_time: string;
  end_time: string | null; // Разрешаем null
  duration: number;
}) => {
  const { id, task_id, user_id, start_time, end_time, duration } = taskTime;

  const query = `
    UPDATE task_times 
    SET start_time = $1, end_time = $2, duration = $3
    WHERE id = $4
    RETURNING *;
  `;
  const values = [start_time, end_time, duration, id];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const updateTimerModel = async ({
  task_id,
  elapsed_time,
  is_running,
}: {
  task_id: string;
  elapsed_time: number;
  is_running: boolean;
}) => {
  const query = `
    UPDATE task_times 
    SET duration = $1, end_time = CASE WHEN $2 = false THEN NOW() ELSE end_time END
    WHERE task_id = $3 AND end_time IS NULL
    RETURNING *;
  `;
  const values = [elapsed_time, is_running, task_id];

  const { rows } = await pool.query(query, values);
  return rows[0];
};
