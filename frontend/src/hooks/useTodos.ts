import { useQuery } from "@tanstack/react-query";
import todosService from "../services/todos.service";

export const useTodos = () => {
  return useQuery({
    queryKey: ["todos"],
    queryFn: todosService.getTodos,
    select: (data) => data,
    staleTime: 0, // Помечаем данные как устаревшие сразу после изменения
    retry: 2,
  });
};
