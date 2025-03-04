import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../../models/Task';
import { TaskState } from '../../models/TaskState';
import { Filter } from '../../models/InitialTask';

const initialState: TaskState = {
  tasks: {},
  timer: {},
  filter: 'all',
};

const taskSlice = createSlice({
  name: 'todoTasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      const {
        id,
        description,
        isDone,
        hasTimer,
        alarmTime,
        folderId,
        category,
      } = action.payload;
      state.tasks[id] = {
        id,
        description,
        isDone,
        hasTimer,
        alarmTime,
        folderId,
        category,
      };
      state.timer[id] = { time: 0, isRunning: false };
    },

    updateTaskOptions: (
      state,
      action: PayloadAction<{
        id: string;
        hasTimer?: boolean;
        alarmTime?: string | null;
        folderId?: string | null;
        category?: string; // ✅ Добавляем возможность обновлять категорию
      }>
    ) => {
      const { id, hasTimer, alarmTime, folderId, category } = action.payload;
      if (state.tasks[id]) {
        if (hasTimer !== undefined) state.tasks[id].hasTimer = hasTimer;
        if (alarmTime !== undefined) state.tasks[id].alarmTime = alarmTime;
        if (folderId !== undefined) state.tasks[id].folderId = folderId;
        if (category !== undefined) state.tasks[id].category = category;
      }
    },
    updateTask: (
      state,
      action: PayloadAction<{ id: string; description: string }>
    ) => {
      const { id, description } = action.payload;
      if (state.tasks[id]) {
        state.tasks[id].description = description;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      delete state.tasks[id];
      delete state.timer[id];
    },
    markTaskDone: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.tasks[id]) {
        state.tasks[id].isDone = true;
      }
    },
    toggleTimer: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const timer = state.timer[id];
      if (timer) {
        timer.isRunning = !timer.isRunning;
      }
    },
    resetTimer: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const timer = state.timer[id];
      if (timer) {
        timer.time = 0;
        timer.isRunning = false;
      }
    },
    incrementTime: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const timer = state.timer[id];
      if (timer && timer.isRunning) {
        timer.time += 1;
      }
    },
    setFilterValue: (state, action: PayloadAction<Filter>) => {
      state.filter = action.payload;
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  markTaskDone,
  toggleTimer,
  resetTimer,
  incrementTime,
  setFilterValue,
  updateTaskOptions,
} = taskSlice.actions;

export default taskSlice.reducer;
