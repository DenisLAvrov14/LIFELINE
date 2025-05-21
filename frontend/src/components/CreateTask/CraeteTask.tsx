import React, { useContext, useState, useRef, useEffect } from 'react';
import { BiSolidPlusCircle, BiFolderPlus } from 'react-icons/bi';
import { FaEdit } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { addTask } from '../../redux/taskSlice/CreateTaskSlice';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import todosService from '../../services/todos.service';
import { useKeycloak } from '@react-keycloak/web';
import { ThemeContext } from '../../providers/ThemeProvider/ThemeProvider';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { AxiosError } from 'axios';
import posthog from 'posthog-js';

interface Folder {
  id: string;
  name: string;
}

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
  const { keycloak } = useKeycloak();
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

  // Запрос на получение папок
  const { data: folders = [] } = useQuery<Folder[]>({
    queryKey: ['folders'],
    queryFn: todosService.getFolders,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (!taskDescription.trim()) return;

      // явно приводим alarmTime к string | null
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

      // 🟢 Отправляем в PostHog
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

  // 🟢 Если включен Timer — показываем календарь сразу
  useEffect(() => {
    if (hasTimer && flatpickrRef.current) {
      flatpickrRef.current.flatpickr.open();
    }
  }, [hasTimer]);

  return (
    <div
      className={`p-6 rounded-lg transition-all ${theme === 'dark' ? 'dark' : ''}`}
    >
      {/* Основной контейнер */}
      <div className="relative max-w-[620px] flex flex-col px-4 py-4 rounded-lg space-y-2 mx-auto bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white">
        {/* 🔹 Первая строка: Ввод + кнопка */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Enter your task..."
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="flex-grow h-[38px] px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring"
          />
          <button
            onClick={() => mutation.mutate()}
            disabled={!taskDescription.trim()}
            className="w-[40px] h-[38px] flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            <BiSolidPlusCircle size={20} />
          </button>
        </div>

        {/* Вторая строка: чекбоксы, категории, папки, таймер */}
        <div className="flex flex-wrap items-center justify-between space-x-2">
          {/* Чекбоксы */}
          <div className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg h-[38px]">
            <label className="flex items-center space-x-1 text-gray-900 dark:text-white text-sm">
              <input
                type="checkbox"
                checked={isQuickTask}
                onChange={() => setIsQuickTask(!isQuickTask)}
                className="form-checkbox text-blue-600 w-4 h-4"
              />
              <span>Quick Task</span>
            </label>

            <label className="flex items-center space-x-1 text-gray-900 dark:text-white text-sm">
              <input
                type="checkbox"
                checked={hasTimer}
                onChange={() => setHasTimer(!hasTimer)}
                className="form-checkbox text-blue-600 w-4 h-4"
              />
              <span>Timer</span>
            </label>
          </div>

          {/* Категории */}
          <select
            onChange={(e) => setTaskCategory(e.target.value)}
            value={taskCategory}
            className="w-[140px] px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white h-[38px]"
          >
            <option value="">Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Папки */}
          <select
            onChange={(e) => setFolderId(e.target.value || undefined)}
            value={folderId || ''}
            className="w-[140px] px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white h-[38px]"
          >
            <option value="">No Folder</option>
            {folders?.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>

          {/* Кнопки */}
          <div className="flex space-x-2">
            <button className="w-[40px] h-[38px] flex items-center justify-center bg-gray-300 dark:bg-gray-600 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500">
              <FaEdit size={16} />
            </button>
            <button className="w-[40px] h-[38px] flex items-center justify-center bg-gray-300 dark:bg-gray-600 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500">
              <BiFolderPlus size={18} />
            </button>
          </div>
        </div>

        {/* 🔹 Адаптивный инпут-календарь */}
        {hasTimer && (
          <div className="flex items-center px-3 py-1.5 bg-gray-300 dark:bg-gray-600 rounded-lg h-[38px] w-[170px]">
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
