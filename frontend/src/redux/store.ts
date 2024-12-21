import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as useDispatchLib,
  useSelector as useSelectorLib,
} from 'react-redux';
import taskSlice from './taskSlice/CreateTaskSlice';

export const store = configureStore({
  reducer: {
    tasks: taskSlice, // Используем taskSlice напрямую, без reducerPath
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = useDispatchLib;
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorLib;
