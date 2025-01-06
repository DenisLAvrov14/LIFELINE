import axios, { AxiosError } from 'axios';

const API_URL = 'http://localhost:3001';

export const getTodos = async () => {
  try {
    const response = await axios.get(`${API_URL}/todos`);
    return response.data;
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
};

export const updateTodo = async (
  id: string,
  userId: string,
  description: string,
  isDone: boolean
) => {
  try {
    const response = await axios.put(`${API_URL}/todos/${id}`, {
      userId, // Передаем userId для возможного обновления
      description,
      isDone,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};

export const deleteTodo = async (id: string) => {
  try {
    await axios.delete(`${API_URL}/todos/${id}`);
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};

export const createUser = async (username: string, email: string) => {
  try {
    const response = await axios.post(`${API_URL}/users`, { username, email });
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const createTask = async (description: string, userId: string) => {
  try {
    const response = await axios.post(`${API_URL}/tasks`, {
      description,
      is_done: false,
      userId, // Передаем userId
    });
    console.log('Task created successfully!');
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const createTaskTime = async (
  taskId: number,
  userId: string | null,
  startTime: Date,
  endTime: Date,
  duration: number
) => {
  const startTimeFormatted = startTime
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');
  const endTimeFormatted = endTime.toISOString().slice(0, 19).replace('T', ' ');

  try {
    const response = await axios.post(`${API_URL}/task-times`, {
      task_id: taskId,
      user_id: userId, // Передаём userId
      start_time: startTimeFormatted,
      end_time: endTimeFormatted,
      duration,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating task time:', error);
    throw error;
  }
};

export const getTaskTimes = async (userId: string) => {
  try {
    const response = await axios.get(`${API_URL}/task-times/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting task times:', error);
    throw error;
  }
};

export const taskIsDone = async (taskId: string, userId: string) => {
  try {
    const response = await axios.put(`${API_URL}/tasks/${taskId}/done`, {
      userId,
    });
    return response.data;
  } catch (error) {
    console.error('Error marking task as done:', error);
    throw error;
  }
};

export const saveTaskTime = async (
  taskId: string,
  userId: string,
  startTime: Date,
  endTime: Date,
  duration: number
) => {
  try {
    const response = await axios.post(`${API_URL}/task-times`, {
      task_id: taskId,
      user_id: userId,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      duration: Math.round(duration),
    });
    return response.data;
  } catch (error) {
    console.error('Error saving task time:', error);
    throw error;
  }
};

export const startTimer = async (taskId: string, startTime: Date) => {
  try {
    const response = await axios.post(`${API_URL}/timer/start`, {
      task_id: taskId,
      user_id: '00000000-0000-0000-0000-000000000001',
      start_time: startTime.toISOString(),
    });
    return response.data;
  } catch (error) {
    console.error('Error starting timer:', error);
    throw error;
  }
};

export const pauseTimer = async (taskId: string, elapsedTime: number) => {
  try {
    const response = await axios.post(`${API_URL}/timer/pause`, {
      task_id: taskId,
      elapsed_time: Math.round(elapsedTime),
      is_running: false,
    });
    console.log('Timer paused:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error pausing timer:', error);
    throw error;
  }
};

export const resumeTimer = async (taskId: string, elapsedTime: number) => {
  try {
    const response = await axios.post(`${API_URL}/task-times/resume`, {
      task_id: taskId,
      elapsed_time: Math.round(elapsedTime),
    });
    console.log('Timer resumed:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error resuming timer:', error);
    throw error;
  }
};

export const updateTaskTime = async (
  id: string,
  taskId: string,
  userId: string,
  startTime: Date,
  endTime: Date | null,
  duration: number
) => {
  console.log('Sending task time update:', {
    id,
    task_id: taskId,
    user_id: userId,
    start_time: startTime.toISOString(),
    end_time: endTime ? endTime.toISOString() : null,
    duration: Math.round(duration),
  });

  try {
    const response = await axios.post(
      `${API_URL}/task-times/update-task-time`,
      {
        id,
        task_id: taskId,
        user_id: userId,
        start_time: startTime.toISOString(),
        end_time: endTime ? endTime.toISOString() : null,
        duration: Math.round(duration),
      }
    );
    console.log('Task time update response:', response.data);
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error(
      'Error updating task time:',
      err.response?.data || err.message
    );
    throw err;
  }
};

export const stopTimer = async (taskId: string, endTime: Date) => {
  try {
    const response = await axios.post(`${API_URL}/timer/stop`, {
      task_id: taskId,
      end_time: endTime.toISOString(),
    });
    return response.data;
  } catch (error) {
    console.error('Error stopping timer:', error);
    throw error;
  }
};

export const getTimerStatus = async (taskId: string) => {
  try {
    const response = await axios.get(`${API_URL}/task-times/status/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting timer status:', error);
    throw error;
  }
};

export const getFilteredStats = async (userId: string) => {
  try {
    const response = await axios.get(`${API_URL}/statistics/weekly-stats`, {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error(
      'Error fetching filtered stats:',
      err.response?.data || err.message
    );
    throw err;
  }
};

const todosService = {
  getTodos,
  updateTodo,
  deleteTodo,
  createUser,
  createTask,
  createTaskTime,
  getTaskTimes,
  taskIsDone,
  saveTaskTime,
  startTimer,
  updateTaskTime,
  stopTimer,
  getTimerStatus,
  pauseTimer,
  resumeTimer,
  getFilteredStats,
};

export default todosService;
