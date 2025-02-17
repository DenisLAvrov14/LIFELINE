import express from "express";
import { connectDatabase } from "./services/db.connection";
import cors from "cors";
import todosRoutes from "./routes/todos.routes";
import taskTimesRoutes from "./routes/task_times.routes";
import tasksRoutes from "./routes/tasks.routes";
import userRoutes from "./routes/user.routes";
import timerRoutes from "./routes/timer.routes";
import statisticsRoutes from "./routes/statistics.routes";
import fs from "fs";

const app = express();
const PORT = process.env.PORT;

// Подключаем CORS с учетом безопасности
app.use(
  cors({
    origin: "http://localhost:5173", // Замените на реальный URL фронтенда в продакшене
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Middleware для обработки JSON
app.use(express.json());

// Подключаемся к базе данных
connectDatabase()
  .then(() => console.log("Connected to the database."))
  .catch((err) => console.error("Failed to connect to the database:", err));

// Логирование всех запросов
app.use((req, res, next) => {
  console.log(`Request Method: ${req.method}, URL: ${req.url}`);
  next();
});

// Подключение маршрутов с базовыми путями
app.use("/api/todos", todosRoutes);
app.use("/api/task-times", taskTimesRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/users", userRoutes);
app.use("/api/timer", timerRoutes);
app.use("/api/statistics", statisticsRoutes);

// Обработчик 404
app.use((req, res) => {
  res.status(404).json({ error: `Cannot find route ${req.url}` });
});

// Добавляем тестовый обработчик для проверки
app.use("*", (req, res) => {
  res.status(404).send(`Cannot find route ${req.url}`);
});

// Логирование ошибок
const logFile = fs.createWriteStream("backend.log", { flags: "a" });

console.log = (msg) => {
    logFile.write(`[${new Date().toISOString()}] ${msg}\n`);
    process.stdout.write(`[${new Date().toISOString()}] ${msg}\n`);
};

console.error = (msg) => {
    logFile.write(`[${new Date().toISOString()}] ERROR: ${msg}\n`);
    process.stderr.write(`[${new Date().toISOString()}] ERROR: ${msg}\n`);
};

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
