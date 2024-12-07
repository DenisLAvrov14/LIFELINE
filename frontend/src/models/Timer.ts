export type TimerProps = {
  taskId: string;
  onSaveTime: (taskId: string, time: number) => void;
};
