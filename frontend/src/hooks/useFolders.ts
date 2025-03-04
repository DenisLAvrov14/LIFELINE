import { useQuery } from '@tanstack/react-query';
import todosService from '../services/todos.service';

export const useFolders = () => {
  return useQuery({
    queryKey: ['folders'],
    queryFn: todosService.getFolders, // Добавляем метод получения папок
    select: (data) => data,
    staleTime: 0, // Данные считаются устаревшими сразу после изменения
    retry: 2, // Количество повторных попыток при ошибке
  });
};
