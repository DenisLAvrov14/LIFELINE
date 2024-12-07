import axios from 'axios';

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

export const addTodo = async (description: string, is_done: boolean) => {
  try {
    const response = await axios.post(`${API_URL}/tasks`, { description, is_done });
    return response.data;
  } catch (error) {
    console.error('Error adding todo:', error);
    throw error;
  }
};

export const updateTodo = async (id: string, description: string, is_done: boolean) => {
  try {
    const response = await axios.put(`${API_URL}/todos/${id}`, { description, is_done });
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

export const createTask = async (description: string) => {
  try {
    const response = await axios.post(`${API_URL}/tasks`, {
      description,
      is_done: false,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};


export const createTaskTime = async (taskId: number, userId: string | null, startTime: Date, endTime: Date, duration: number) => {
  const startTimeFormatted = startTime.toISOString().slice(0, 19).replace('T', ' ');
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

export const taskIsDone = async (taskId: string) => {
  try {
    const response = await axios.put(`${API_URL}/tasks/${taskId}/done`, {
      is_done: true, 
    });
    return response.data;
  } catch (error) {
    console.error("Error marking task as done:", error);
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
      console.error("Error saving task time:", error);
      throw error;
  }
};


export const startTimer = async (taskId: string, startTime: Date) => {
  try {
    const response = await axios.post(`${API_URL}/timer/start`, {
      task_id: taskId,
      user_id: "00000000-0000-0000-0000-000000000001",
      start_time: startTime.toISOString(),
    });
    return response.data;
  } catch (error) {
    console.error("Error starting timer:", error);
    throw error;
  }
};


export const updateTimer = async (taskId: string, elapsedTime: number, isRunning: boolean) => {
  try {
      const response = await axios.post(`${API_URL}/timer/update`, {
          task_id: taskId,
          elapsed_time: Math.round(elapsedTime), // Округляем до целого числа
          is_running: isRunning,
      });
      return response.data;
  } catch (error) {
      console.error('Error updating timer:', error);
      throw error;
  }
};

export const stopTimer = async (taskId: string, endTime: Date) => {
  try {
    const response = await axios.post(`${API_URL}/timer/stop`, { task_id: taskId, end_time: endTime.toISOString() });
    return response.data;
  } catch (error) {
    console.error('Error stopping timer:', error);
    throw error;
  }
};

export const getTimerStatus = async (taskId: string) => {
  try {
    const response = await axios.get(`${API_URL}/timer/status/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting timer status:', error);
    throw error;
  }
};

const todosService = {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  createUser,
  createTask,
  createTaskTime,
  getTaskTimes,
  taskIsDone,
  saveTaskTime,
  startTimer,
  updateTimer,
  stopTimer,
  getTimerStatus
};

export default todosService;
