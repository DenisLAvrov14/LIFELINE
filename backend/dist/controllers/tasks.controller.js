"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markTaskAsDone = exports.deleteTask = exports.updateTask = exports.createTask = exports.getTasks = void 0;
const db_connection_1 = __importDefault(require("../services/db.connection"));
// Получение всех задач
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_connection_1.default.query(`SELECT id, description, "isDone", created_at AS "createdAt" FROM tasks`);
        res.json(result.rows);
    }
    catch (error) {
        console.error("Error fetching tasks:", error.message);
        res.status(500).send(error.message);
    }
});
exports.getTasks = getTasks;
// Создание новой задачи
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { description, isDone = false, userId } = req.body; // Добавляем userId
    try {
        const result = yield db_connection_1.default.query(`INSERT INTO tasks (description, "isDone", user_id) VALUES ($1, $2, $3) RETURNING id, description, "isDone", created_at AS "createdAt"`, [description, isDone, userId]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error("Error creating task:", error.message);
        res.status(500).send(error.message);
    }
});
exports.createTask = createTask;
// Обновление задачи
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { description, isDone } = req.body;
    if (description === undefined || isDone === undefined) {
        return res
            .status(400)
            .json({ message: "Invalid data: description and isDone are required" });
    }
    console.log(`Updating task with ID: ${id}`);
    console.log(`New description: ${description}`);
    console.log(`New isDone status: ${isDone}`);
    try {
        const result = yield db_connection_1.default.query(`UPDATE tasks SET description = $1, "isDone" = $2 WHERE id = $3 RETURNING id, description, "isDone", created_at AS "createdAt"`, [description, isDone, id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Task not found" });
        }
        console.log(`Update result:`, result.rows[0]);
        res.status(200).json(result.rows[0]);
    }
    catch (error) {
        console.error("Error updating task:", error.message);
        res.status(500).send(error.message);
    }
});
exports.updateTask = updateTask;
// Удаление задачи
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield db_connection_1.default.query("DELETE FROM tasks WHERE id = $1", [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.sendStatus(204);
    }
    catch (error) {
        console.error("Error deleting task:", error.message);
        res.status(500).send(error.message);
    }
});
exports.deleteTask = deleteTask;
// Отметить задачу как выполненную
const markTaskAsDone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const { userId } = req.body;
    console.log("Received task ID:", id);
    console.log("Received user ID:", userId);
    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }
    try {
        // Проверяем существование задачи
        const taskQuery = `
      SELECT * 
      FROM tasks 
      WHERE id = $1::uuid AND user_id = $2::uuid AND "isDone" = false
    `;
        const taskResult = yield db_connection_1.default.query(taskQuery, [id, userId]);
        if (taskResult.rowCount === 0) {
            console.error("Task not found or already completed");
            return res
                .status(404)
                .json({ message: "Task not found or already completed" });
        }
        const task = taskResult.rows[0];
        // Вычисляем общее время выполнения задачи
        const timeQuery = `
      SELECT COALESCE(SUM(duration), 0) AS total_time 
      FROM task_times 
      WHERE task_id = $1::uuid
    `;
        const timeResult = yield db_connection_1.default.query(timeQuery, [id]);
        const totalTime = ((_a = timeResult.rows[0]) === null || _a === void 0 ? void 0 : _a.total_time) || 0;
        console.log("Preparing to insert into completed_tasks with values:", {
            userId,
            id,
            description: task.description,
            totalTime,
        });
        // Добавляем задачу в таблицу `completed_tasks`
        const insertQuery = `
      INSERT INTO completed_tasks (id, user_id, task_id, description, total_time, completed_at)
      VALUES (gen_random_uuid(), $1::uuid, $2::uuid, $3, $4, NOW())
      RETURNING *
    `;
        const insertResult = yield db_connection_1.default.query(insertQuery, [
            userId,
            id,
            task.description,
            totalTime,
        ]);
        if (insertResult.rowCount === 0) {
            console.error("Failed to insert task into completed_tasks");
            return res
                .status(500)
                .json({ message: "Failed to insert task into completed_tasks" });
        }
        console.log("Insert completed task result:", insertResult.rows[0]);
        // Обновляем статус задачи в таблице `tasks`
        const updateQuery = `
      UPDATE tasks
      SET "isDone" = true
      WHERE id = $1::uuid
      RETURNING *
    `;
        const updateResult = yield db_connection_1.default.query(updateQuery, [id]);
        if (updateResult.rowCount === 0) {
            console.error("Failed to update task status in tasks");
            return res
                .status(500)
                .json({ message: "Failed to update task status in tasks" });
        }
        console.log("Update task result:", updateResult.rows[0]);
        // Возвращаем успешный ответ
        res.status(200).json({
            message: "Task marked as done and updated in tasks.",
            completedTask: insertResult.rows[0],
        });
    }
    catch (error) {
        console.error("Error marking task as done:", error.message);
        if (error.code) {
            console.error("Database error code:", error.code);
            console.error("Query:", error.query);
        }
        res
            .status(500)
            .json({ error: `Error marking task as done: ${error.message}` });
    }
});
exports.markTaskAsDone = markTaskAsDone;
