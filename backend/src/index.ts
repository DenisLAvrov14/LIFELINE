import express from 'express';
import bodyParser from 'body-parser';
import { connectDatabase } from './services/db.connection';
import cors from 'cors';
import todosRoutes from './routes/todos.routes';
import taskTimesRoutes from './routes/task_times.routes';
import tasksRoutes from './routes/tasks.routes';
import userRoutes from './routes/user.routes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

// Подключаемся к базе данных
connectDatabase();

// Подключение маршрутов с базовыми путями
app.use('/todos', todosRoutes); 
app.use('/task-times', taskTimesRoutes); 
app.use('/tasks', tasksRoutes); 
app.use('/users', userRoutes);
app.use('/timer', taskTimesRoutes);

app.use((req, res, next) => {
  console.log(`Request URL: ${req.url}`);
  next();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
