"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_connection_1 = require("./services/db.connection");
const cors_1 = __importDefault(require("cors"));
const todos_routes_1 = __importDefault(require("./routes/todos.routes"));
const task_times_routes_1 = __importDefault(
  require("./routes/task_times.routes"),
);
const tasks_routes_1 = __importDefault(require("./routes/tasks.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const timer_routes_1 = __importDefault(require("./routes/timer.routes"));
const statistics_routes_1 = __importDefault(
  require("./routes/statistics.routes"),
);
const folders_routes_1 = __importDefault(require("./routes/folders.routes"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const PORT = process.env.PORT;
// Подключаем CORS с учетом безопасности
app.use(
  (0, cors_1.default)({
    origin: "http://localhost:5173", // Замените на реальный URL фронтенда в продакшене
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
// Middleware для обработки JSON
app.use(express_1.default.json());
// Подключаемся к базе данных
(0, db_connection_1.connectDatabase)()
  .then(() => console.log("Connected to the database."))
  .catch((err) => console.error("Failed to connect to the database:", err));
// Логирование всех запросов
app.use((req, res, next) => {
  console.log(`Request Method: ${req.method}, URL: ${req.url}`);
  next();
});
// Подключение маршрутов с базовыми путями
app.use("/api/todos", todos_routes_1.default);
app.use("/api/task-times", task_times_routes_1.default);
app.use("/api/tasks", tasks_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.use("/api/timer", timer_routes_1.default);
app.use("/api/statistics", statistics_routes_1.default);
app.use("/api/folders", folders_routes_1.default);
// Обработчик 404
app.use((req, res) => {
  res.status(404).json({ error: `Cannot find route ${req.url}` });
});
// Добавляем тестовый обработчик для проверки
app.use("*", (req, res) => {
  res.status(404).send(`Cannot find route ${req.url}`);
});
// Логирование ошибок
const logFile = fs_1.default.createWriteStream("backend.log", { flags: "a" });
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
