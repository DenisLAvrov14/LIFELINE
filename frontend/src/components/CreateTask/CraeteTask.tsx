import React, { useContext, useState } from 'react';
import { BiSolidPlusCircle } from 'react-icons/bi';
import { FaEdit } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { addTask } from '../../redux/taskSlice/CreateTaskSlice';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import todosService from '../../services/todos.service';
import { useKeycloak } from '@react-keycloak/web';
import { ThemeContext } from '../../providers/ThemeProvider/ThemeProvider'; // Подключаем контекст темы

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
  const { theme } = useContext(ThemeContext); // Получаем текущую тему

  const [taskDescription, setTaskDescription] = useState<string>('');
  const [hasTimer, setHasTimer] = useState<boolean>(false);
  const [alarmTime, setAlarmTime] = useState<string | undefined>(undefined);
  const [folderId, setFolderId] = useState<string | undefined>(undefined);
  const [isQuickTask, setIsQuickTask] = useState<boolean>(false);
  const [taskCategory, setTaskCategory] = useState<string>('');

  // Запрос на получение папок
  const { data: folders = [] } = useQuery<Folder[]>({
    queryKey: ['folders'],
    queryFn: todosService.getFolders,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (!keycloak?.tokenParsed?.sub) {
        throw new Error('Token or userId is missing');
      }
      const newTask = {
        description: taskDescription,
        userId: String(keycloak.tokenParsed.sub),
        hasTimer: !isQuickTask && hasTimer,
        alarmTime: hasTimer ? (alarmTime ?? null) : null,
        folderId: folderId ?? null,
        category: taskCategory || null,
      };
      return await todosService.createTask(newTask);
    },
    onSuccess: (data) => {
      if (!data) {
        console.error('No data returned from createTask');
        return;
      }
      dispatch(
        addTask({
          id: data.id,
          description: data.description,
          isDone: isQuickTask,
          hasTimer: data.has_timer,
          alarmTime: data.alarm_time,
          folderId: data.folder_id,
          category: data.category,
        })
      );
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setTaskDescription('');
      setHasTimer(false);
      setAlarmTime(undefined);
      setFolderId(undefined);
      setIsQuickTask(false);
      setTaskCategory('');
    },
    onError: (error) => {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
    },
  });

  return (
    <div
      className={`p-6 rounded-lg transition-all ${theme === 'dark' ? 'dark' : ''}`}
    >
      {/* Основной контейнер */}
      <div className="max-w-[615px] flex flex-col px-4 py-4 rounded-lg space-y-2 mx-auto bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white">
        {/* Первая строка: Ввод + кнопка */}
        <div className="flex items-center justify-center space-x-2">
          <input
            type="text"
            placeholder="Enter your task..."
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            className="w-[535px] h-[38px] px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring"
          />
          <button
            onClick={() => mutation.mutate()}
            className="w-[38px] h-[38px] flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            <BiSolidPlusCircle size={20} />
          </button>
        </div>

        {/* Вторая строка: чекбоксы, категории, папки, управление */}
        <div className="flex items-center justify-center space-x-2">
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

            {!isQuickTask && (
              <label className="flex items-center space-x-1 text-gray-900 dark:text-white text-sm">
                <input
                  type="checkbox"
                  checked={hasTimer}
                  onChange={() => setHasTimer(!hasTimer)}
                  className="form-checkbox text-blue-600 w-4 h-4"
                />
                <span>Timer</span>
              </label>
            )}
          </div>

          {/* Категории */}
          <select
            onChange={(e) => setTaskCategory(e.target.value)}
            value={taskCategory}
            className="w-[180px] px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white h-[38px]"
          >
            <option value="">Select Category</option>
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
            className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white h-[38px]"
          >
            <option value="">No Folder</option>
            {folders?.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>

          {/* Кнопки управления папками */}
          <button className="w-[38px] h-[38px] flex items-center justify-center bg-gray-300 dark:bg-gray-600 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500">
            <BiSolidPlusCircle size={18} />
          </button>

          <button className="w-[38px] h-[38px] flex items-center justify-center bg-gray-300 dark:bg-gray-600 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500">
            <FaEdit size={16} />
          </button>

          {/* Таймер (если включен) */}
          {hasTimer && (
            <input
              type="datetime-local"
              value={alarmTime || ''}
              onChange={(e) => setAlarmTime(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white h-[38px]"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
