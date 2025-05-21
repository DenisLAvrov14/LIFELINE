export interface Task {
  id: string;
  userId?: string;
  description: string;
  isDone: boolean;
  createdAt?: string;
  hasTimer?: boolean;
  alarmTime?: string | null;
  folderId?: string | null;
  category?: string;
  isQuickTask?: boolean;
}
