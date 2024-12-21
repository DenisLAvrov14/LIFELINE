import { Task } from './Task';
import { TimerState } from './TimerState';

export interface TaskState {
  tasks: Record<string, Task>;
  timer: Record<string, TimerState>;
  filter: string;
}
