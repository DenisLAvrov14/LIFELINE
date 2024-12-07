import React, { ChangeEvent, useCallback, useState } from "react";
import styles from "./CreateTask.module.css";
import { BiSolidPlusCircle } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { setFilterValue, addTask } from "../../redux/taskSlice/CreateTaskSlice";
import { IconButton } from "../../components/IconButton/IconButton";
import { Filter } from "../../models/InitialTask";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import todosService from "../../services/todos.service";
import ChangeTheme from "../../components/ChangeTheme/ChangeTheme";

const CreateTask: React.FC = () => {
  const dispatch = useDispatch();
  const [taskDescription, setTaskDescription] = useState<string>("");
  const [filterValue, setLocalFilterValue] = useState<Filter>("all");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (description: string) => {
      return await todosService.createTask(description);
    },
    onSuccess: async (data) => {
      const startTime = new Date();
      const endTime = new Date();
      const duration = 0;
      const userId = "00000000-0000-0000-0000-000000000001";

      try {
        await todosService.createTaskTime(data.id, userId, startTime, endTime, duration);

        // Обновляем Redux store
        dispatch(
          addTask({
            id: data.id,
            description: data.description,
            isDone: false,
          })
        );

        // Инвалидируем кэш React Query
        queryClient.invalidateQueries({ queryKey: ["todos"] });
        alert("Task was added successfully!");
      } catch (error) {
        console.error("Error creating task time:", error);
        alert("Error adding task time. Please try again.");
      }

      setTaskDescription(""); // Сброс поля ввода
    },
    onError: (error) => {
      console.error("Error creating task:", error);
      alert("Failed to create task. Please try again.");
    },
  });

  const handleAddTask = useCallback(() => {
    if (!taskDescription.trim()) {
      alert("Task description cannot be empty.");
      return;
    }

    mutation.mutate(taskDescription);
  }, [mutation, taskDescription]);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTaskDescription(e.target.value);
  }, []);

  const handleFilterChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const newFilter = event.target.value as Filter;
      setLocalFilterValue(newFilter);
      dispatch(setFilterValue(newFilter));
    },
    [dispatch]
  );

  return (
    <div className={styles.tasker}>
      <div className={styles.ChangeThemeContainer}>
        <ChangeTheme />
      </div>
      <h2>TO DO LIST</h2>
      <div className={styles.addtsk}>
        <input
          type="text"
          placeholder="Enter your task"
          value={taskDescription}
          onChange={handleInputChange}
          autoFocus
        />
        <IconButton onClick={handleAddTask}>
          <BiSolidPlusCircle title="Add task" />
        </IconButton>
        <select onChange={handleFilterChange} value={filterValue}>
          <option value="all">All</option>
          <option value="done">Done</option>
          <option value="undone">Undone</option>
        </select>
      </div>
    </div>
  );
};

export default CreateTask;
