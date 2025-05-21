import { Task } from './Task';

export interface TaskContentProps {
  task: Task;
  isEdit: boolean;
  inputEdit: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isTimerVisible: boolean;
  time: number;
  isAlarmTriggered: boolean;
}
