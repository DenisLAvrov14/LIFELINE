import axios, { AxiosError } from 'axios';
import { KeycloakInstance } from 'keycloak-js';
import {jwtDecode} from 'jwt-decode';

// Читаем URL из .env
const API_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_URL) {
  throw new Error('API URL is not defined. Check your .env file.');
}

// Экземпляр Keycloak
let keycloakInstance: KeycloakInstance | null = null;

// Устанавливаем экземпляр Keycloak
export const setKeycloakInstance = (kc: KeycloakInstance) => {
  keycloakInstance = kc;
};

// Создаём инстанс axios с базовым URL
const apiClient = axios.create({
  baseURL: API_URL,
});

// Функция обновления токена
const refreshAccessToken = async () => {
  if (keycloakInstance && keycloakInstance.refreshToken) {
    try {
      const isUpdated = await keycloakInstance.updateToken(30); // Обновляем за 30 секунд до истечения
      if (isUpdated) {
        console.log('Access token refreshed');
      }
    } catch (err) {
      console.error('Failed to refresh token:', err);
      throw new Error('Unable to refresh token. Please login again.');
    }
  }
};

// Добавляем токен в заголовок Authorization
apiClient.interceptors.request.use(async (config) => {
  if (keycloakInstance) {
    await refreshAccessToken(); // Проверяем и обновляем токен
    if (keycloakInstance.token) {
      console.log("✅ Adding Authorization Header:", `Bearer ${keycloakInstance.token}`);
      config.headers.Authorization = `Bearer ${keycloakInstance.token}`;
    }
  }
  return config;
});

// Функция для получения задач
export const getTodos = async (): Promise<any> => {
  if (!keycloakInstance || !keycloakInstance.token) {
    console.error("❌ User ID is missing from token!", keycloakInstance?.tokenParsed);
    throw new Error('Keycloak instance or token is not available.');
  }

  try {
    const response = await apiClient.get('/todos');
    return response.data;
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      console.error('Error fetching todos:', err.response?.data || err.message);
      throw new Error(
        err.response?.data?.error || 'Failed to fetch todos. Please try again later.'
      );
    }
    throw err;
  }
};


export const updateTodo = async (
  id: string,
  userId: string,
  description: string,
  isDone: boolean
) => {
  try {
    const response = await apiClient.put(`/todos/${id}`, {
      userId,
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
    await apiClient.delete(`/todos/${id}`);
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

export const createTask = async (description: string) => {
  if (!keycloakInstance?.tokenParsed?.sub) {
    throw new Error('User ID is missing. Please check your authentication.');
  }

  const userId = keycloakInstance.tokenParsed.sub;
  console.log("✅ Extracted userId from token:", userId);

  try {
    const response = await apiClient.post('/tasks', {
      description,
      is_done: false,
      userId, // Передаем userId из токена
    });

    console.log('Task created successfully!', response.data);
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
  if (!keycloakInstance?.token) {
    throw new Error("Token is missing. Please login again.");
  }

  const startTimeFormatted = startTime
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');
  const endTimeFormatted = endTime.toISOString().slice(0, 19).replace('T', ' ');

  try {
    const response = await apiClient.post(
      `/task-times`,
      {
        task_id: taskId,
        user_id: userId, // Передаём userId
        start_time: startTimeFormatted,
        end_time: endTimeFormatted,
        duration,
      },
      {
        headers: {
          Authorization: `Bearer ${keycloakInstance.token}`, // Передаём токен
        },
      }
    );
    console.log("Task time created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating task time:", error);
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

export const taskIsDone = async (taskId: string, token: string) => {
  const userId = jwtDecode<any>(token)?.sub;

  if (!userId) {
    throw new Error('User ID is missing from token');
  }

  try {
    const response = await axios.put(
      `${API_URL}/tasks/${taskId}/done`,
      { userId },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Здесь должен быть токен
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error marking task as done:', error);
    throw error;
  }
};

export const saveTaskTime = async (
  taskId: string,
  startTime: Date,
  endTime: Date,
  duration: number
) => {
  try {
    const response = await apiClient.post('/task-times', {
      task_id: taskId,
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

export const getFilteredStats = async (token: string, userId: string) => {
  try {
    const response = await axios.get(`${API_URL}/statistics/weekly-stats`, {
      headers: { Authorization: `Bearer ${token}` },
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
