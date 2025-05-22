import React, { useContext, useState, useRef, useEffect } from 'react';
import { BiSolidPlusCircle } from 'react-icons/bi';
import { useDispatch } from 'react-redux';
import { addTask } from '../../redux/taskSlice/CreateTaskSlice';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import todosService from '../../services/todos.service';
import { ThemeContext } from '../../providers/ThemeProvider/ThemeProvider';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { AxiosError } from 'axios';
import posthog from 'posthog-js';

const categories = [
  'Health',
  'Fitness',
  'Intelligence',
  'Creativity',
  'Social Ability',
  'Community Contribution',
  'Environmental Responsibility',
  'Specialized Knowledge',
  'Foreign Language Proficiency',
];

const CreateTask: React.FC = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { theme } = useContext(ThemeContext);

  const [taskDescription, setTaskDescription] = useState<string>('');
  const [hasTimer, setHasTimer] = useState<boolean>(false);
  const [alarmTime, setAlarmTime] = useState<Date | null>(null);
  const [folderId, setFolderId] = useState<string | undefined>(undefined);
  const [isQuickTask, setIsQuickTask] = useState<boolean>(false);
  const [taskCategory, setTaskCategory] = useState<string>('');

  const flatpickrRef = useRef<any>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!taskDescription.trim()) return;

      const alarmTimeValue: string | null =
        hasTimer && alarmTime ? alarmTime.toISOString() : null;

      const newTask = {
        description: taskDescription,
        hasTimer,
        alarmTime: alarmTimeValue,
        folderId: folderId ?? null,
        category: taskCategory || null,
        isQuickTask,
      };

      posthog.capture('task_created', {
        description: taskDescription,
        hasTimer,
        category: taskCategory || 'Uncategorized',
        folderId: folderId || 'None',
        isQuickTask,
      });

      console.log('📤 Payload отправки задачи:', newTask);
      return todosService.createTask(newTask);
    },
    onSuccess: (data) => {
      if (!data) return;

      dispatch(
        addTask({
          id: data.id,
          description: data.description,
          isDone: data.isDone,
          hasTimer: data.hasTimer,
          alarmTime: data.alarmTime,
          folderId: data.folderId,
          category: data.category,
          isQuickTask: data.isQuickTask,
        })
      );

      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setTaskDescription('');
      setHasTimer(false);
      setAlarmTime(null);
      setFolderId(undefined);
      setIsQuickTask(false);
      setTaskCategory('');
    },
    onError: (error: AxiosError) => {
      console.group('❌ createTask failed');
      console.error('Status:', error.response?.status);
      console.error('Body:', error.response?.data);
      console.groupEnd();
      alert(
        'Ошибка при создании задачи: ' +
          ((error.response?.data as { error?: string })?.error || error.message)
      );
    },
  });

  useEffect(() => {
    if (hasTimer && flatpickrRef.current) {
      flatpickrRef.current.flatpickr.open();
    }
  }, [hasTimer]);

  return (
    <div
      className={`p-6 rounded-lg transition-all ${theme === 'dark' ? 'dark' : ''}`}
    >
      <div className="relative w-full sm:max-w-[620px] flex flex-col px-4 py-4 rounded-lg gap-3 mx-auto bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white">
        {/* Первая строка: Ввод + кнопка */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
          <input
            type="text"
            placeholder="Enter your task..."
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="w-full sm:flex-grow h-[38px] px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring"
          />
          <button
            onClick={() => mutation.mutate()}
            disabled={!taskDescription.trim()}
            className="w-full sm:w-[40px] h-[38px] flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            <BiSolidPlusCircle size={20} />
          </button>
        </div>

        {/* Вторая строка */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg h-[38px]">
            <label className="flex items-center space-x-1 text-sm">
              <input
                type="checkbox"
                checked={isQuickTask}
                onChange={() => setIsQuickTask(!isQuickTask)}
                className="form-checkbox text-blue-600 w-4 h-4"
              />
              <span>Quick</span>
            </label>
            <label className="flex items-center space-x-1 text-sm">
              <input
                type="checkbox"
                checked={hasTimer}
                onChange={() => setHasTimer(!hasTimer)}
                className="form-checkbox text-blue-600 w-4 h-4"
              />
              <span>Timer</span>
            </label>
          </div>

          <select
            onChange={(e) => setTaskCategory(e.target.value)}
            value={taskCategory}
            className="w-full sm:w-[140px] px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm h-[38px]"
          >
            <option value="">Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {hasTimer && (
          <div className="flex items-center px-3 py-1.5 bg-gray-300 dark:bg-gray-600 rounded-lg h-[38px] w-full sm:w-[170px]">
            <Flatpickr
              ref={flatpickrRef}
              value={alarmTime || undefined}
              onChange={(date: Date[]) => setAlarmTime(date[0] || null)}
              options={{
                enableTime: true,
                dateFormat: 'd.m.Y H:i',
                minDate: 'today',
                time_24hr: true,
                defaultDate: new Date(),
              }}
              className="w-full bg-transparent text-gray-900 dark:text-white border-none focus:ring-0"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateTask;
