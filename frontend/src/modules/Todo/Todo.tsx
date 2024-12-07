import React, { useMemo } from 'react';
import { useTodos } from '../../hooks/useTodos';
import styles from '../../components/CreateTask/CreateTask.module.css';
import { Task } from '../../models/Task';
import TaskDeck from '../../components/TaskDeck/TaskDeck';
import { RootState, useSelector } from '../../redux/store';
import CreateTask from '../../components/CreateTask/CraeteTask';

const Todo: React.FC = () => {
    const filter = useSelector((state: RootState) => state.tasks.filter);

    const { isLoading, data: queryData } = useTodos();

    // Фильтрация задач на основе текущего значения фильтра из Redux
    const filteredData = useMemo(() => {
        if (!queryData) return [];
      
        console.log("Filter applied:", filter);
        console.log("Data before filtering:", queryData);
        console.log("Data from useTodos (queryData):", queryData);

        switch (filter) {
          case "all":
            return queryData;
          case "done":
            const doneTasks = queryData.filter((task: Task) => task.isDone === true);
            console.log("Done tasks:", doneTasks);
            return doneTasks;
          case "undone":
            const undoneTasks = queryData.filter((task: Task) => task.isDone === false);
            console.log("Undone tasks:", undoneTasks);
            return undoneTasks;
          default:
            return [];
        }
        
      }, [filter, queryData]);  
 
    return (
        <>
            <CreateTask />
            <ul className={styles.tracker}>
                {isLoading ? (
                    <div>Loading...</div>
                ) : filteredData?.length ? (
                    filteredData.map((task: Task) => {
                        console.log("Rendering task:", task);
                        return <TaskDeck key={task.id} task={task} />;
                    })
                ) : (
                    <h1>Data not found</h1>
                )}
            </ul>
        </>
    );
};

export default Todo;
