import React, { ChangeEvent, useCallback, useState } from 'react';
import { BiSolidPlusCircle } from 'react-icons/bi';
import { useDispatch } from 'react-redux';
import { setFilterValue, addTask } from '../../redux/taskSlice/CreateTaskSlice';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import todosService from '../../services/todos.service';
import { useKeycloak } from '@react-keycloak/web'; // Подключаем Keycloak

const CreateTask: React.FC = () => {
  const { keycloak } = useKeycloak(); // Получаем экземпляр Keycloak
  const dispatch = useDispatch();
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [filterValue, setLocalFilterValue] = useState<
    'all' | 'done' | 'undone'
  >('all');

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (description: string) => {
      return await todosService.createTask(description); // Передаём только description
    },
    onSuccess: async (data) => {
      if (!keycloak?.tokenParsed?.sub) { // Используем экземпляр keycloak
        throw new Error('Token or userId is missing');
      }
  
      const userId = keycloak.tokenParsed.sub; // Берём userId из токена
      const startTime = new Date();
      const endTime = new Date();
      const duration = 0;
  
      try {
        await todosService.createTaskTime(
          data.id,
          userId,
          startTime,
          endTime,
          duration
        );
  
        dispatch(
          addTask({
            id: data.id,
            description: data.description,
            isDone: false,
          })
        );
  
        queryClient.invalidateQueries({ queryKey: ['todos'] });
        alert('Task was added successfully!');
      } catch (error) {
        console.error('Error creating task time:', error);
        alert('Error adding task time. Please try again.');
      }
  
      setTaskDescription('');
    },
    onError: (error) => {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
    },
  });  

  const handleAddTask = useCallback(() => {
    if (!taskDescription.trim()) {
      alert('Task description cannot be empty.');
      return;
    }

    mutation.mutate(taskDescription);
  }, [mutation, taskDescription]);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTaskDescription(e.target.value);
  }, []);

  const handleFilterChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const newFilter = event.target.value as 'all' | 'done' | 'undone';
      setLocalFilterValue(newFilter);
      dispatch(setFilterValue(newFilter));
    },
    [dispatch]
  );

  return (
    <div className="flex flex-col items-center px-4 py-6 sm:px-6 lg:px-8 dark:bg-gray">
      <div className="w-full max-w-lg">
        {/* Заголовок */}
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">
          TO DO LIST
        </h2>

        {/* Поле ввода задач */}
        <div className="grid grid-cols-1 sm:grid-cols-[3fr_auto_auto] gap-4 bg-white dark:bg-gray-800 p-4 shadow-md rounded-lg">
          <input
            type="text"
            placeholder="Enter your task"
            value={taskDescription}
            onChange={handleInputChange}
            className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring focus:ring-blue-500 mt-1.5"
            aria-label="Task input"
            autoFocus
          />
          <button
            onClick={handleAddTask}
            className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 transition focus:outline-none focus:ring focus:ring-blue-300"
            aria-label="Add task"
          >
            <BiSolidPlusCircle title="Add task" size={24} />
          </button>
          <select
            onChange={handleFilterChange}
            value={filterValue}
            className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
            aria-label="Filter tasks"
          >
            <option value="all">All</option>
            <option value="done">Done</option>
            <option value="undone">Undone</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
