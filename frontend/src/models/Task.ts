export interface Task {
  id: string;
  description: string;
  isDone: boolean;
  hasTimer?: boolean;
  alarmTime?: string | null;
  folderId?: string | null;
  category?: string; // ✅ Добавляем категорию задачи
}
