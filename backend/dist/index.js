"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const db_connection_1 = require("./services/db.connection");
const cors_1 = __importDefault(require("cors"));
const todos_routes_1 = __importDefault(require("./routes/todos.routes"));
const task_times_routes_1 = __importDefault(require("./routes/task_times.routes"));
const tasks_routes_1 = __importDefault(require("./routes/tasks.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const timer_routes_1 = __importDefault(require("./routes/timer.routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
// Подключаемся к базе данных
(0, db_connection_1.connectDatabase)();
// Подключение маршрутов с базовыми путями
app.use('/todos', todos_routes_1.default);
app.use('/task-times', task_times_routes_1.default);
app.use('/tasks', tasks_routes_1.default);
app.use('/users', user_routes_1.default);
app.use('/timer', timer_routes_1.default);
app.use((req, res, next) => {
    console.log(`Request URL: ${req.url}`);
    next();
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
