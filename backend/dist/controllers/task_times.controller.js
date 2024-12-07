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
exports.updateTimerController = exports.startTimerController = exports.getTimerStatus = exports.deleteTask = exports.markTaskAsDone = exports.updateTaskTimeController = exports.createTaskTimeController = void 0;
const task_times_model_1 = require("../models/task_times.model");
const db_connection_1 = __importDefault(require("../services/db.connection"));
// Создание записи времени выполнения задачи
const createTaskTimeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { task_id, user_id, start_time, end_time, duration } = req.body;
    console.log("Received data:", { task_id, user_id, start_time, end_time, duration });
    if (!task_id || !user_id || !start_time || (!duration && duration !== 0)) {
        return res.status(400).send("Invalid data: Missing required fields");
    }
    try {
        const startTimeFormatted = new Date(start_time).toISOString();
        const endTimeFormatted = end_time ? new Date(end_time).toISOString() : null;
        const roundedDuration = Math.round(duration);
        yield (0, task_times_model_1.createTaskTime)({
            task_id,
            user_id,
            start_time: startTimeFormatted,
            end_time: endTimeFormatted,
            duration: roundedDuration,
        });
        res.status(201).json({ message: "Task time created successfully" });
    }
    catch (error) {
        console.error("Error creating task time:", error.message);
        res.status(500).send(`Error creating task time: ${error.message}`);
    }
});
exports.createTaskTimeController = createTaskTimeController;
// Обновление записи времени выполнения задачи
const updateTaskTimeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, task_id, user_id, start_time, end_time, duration } = req.body;
    try {
        const startTimeFormatted = new Date(start_time).toISOString();
        const endTimeFormatted = new Date(end_time).toISOString();
        yield (0, task_times_model_1.updateTaskTime)({
            id,
            task_id,
            user_id,
            start_time: startTimeFormatted,
            end_time: endTimeFormatted,
            duration,
        });
        res.status(200).json({ message: "Task time updated successfully" });
    }
    catch (error) {
        console.error("Error updating task time:", error.message);
        res.status(500).send(`Error updating task time: ${error.message}`);
    }
});
exports.updateTaskTimeController = updateTaskTimeController;
// Отметить задачу как выполненную
const markTaskAsDone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield db_connection_1.default.query(`UPDATE tasks SET "isDone" = TRUE WHERE id = $1 RETURNING id, description, "isDone", created_at AS "createdAt"`, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }
        res.status(200).json({ success: true, task: result.rows[0] });
    }
    catch (error) {
        console.error("Error marking task as done:", error.message);
        res.status(500).json({ success: false, message: `Error marking task as done: ${error.message}` });
    }
});
exports.markTaskAsDone = markTaskAsDone;
// Удаление задачи и связанных с ней записей времени
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield db_connection_1.default.query("DELETE FROM task_times WHERE task_id = $1", [id]);
        yield db_connection_1.default.query("DELETE FROM tasks WHERE id = $1", [id]);
        res.sendStatus(204);
    }
    catch (error) {
        console.error("Error deleting task:", error.message);
        res.status(500).send("Error deleting task");
    }
});
exports.deleteTask = deleteTask;
// Получение статуса таймера
const getTimerStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { taskId } = req.params;
    try {
        const { rows } = yield db_connection_1.default.query("SELECT * FROM task_times WHERE task_id = $1 ORDER BY start_time DESC LIMIT 1", [taskId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "No timer found for this task" });
        }
        const timerStatus = rows[0];
        res.json({
            start_time: timerStatus.start_time,
            is_running: !timerStatus.end_time,
            duration: timerStatus.duration,
        });
    }
    catch (error) {
        console.error("Error fetching timer status:", error.message);
        res.status(500).send(`Error fetching timer status: ${error.message}`);
    }
});
exports.getTimerStatus = getTimerStatus;
// Запуск таймера
const startTimerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { task_id, user_id, start_time } = req.body;
    if (!task_id || !user_id || !start_time) {
        return res.status(400).json({
            success: false,
            message: "Invalid data: Missing required fields",
        });
    }
    try {
        const startTimeFormatted = new Date(start_time).toISOString();
        yield (0, task_times_model_1.createTaskTime)({
            task_id,
            user_id,
            start_time: startTimeFormatted,
            end_time: null,
            duration: 0,
        });
        res.status(201).json({
            success: true,
            message: "Timer started successfully",
            data: {
                task_id,
                user_id,
                start_time: startTimeFormatted,
            },
        });
    }
    catch (error) {
        console.error("Error starting timer:", error.message);
        res.status(500).json({
            success: false,
            message: "Error starting timer",
            error: error.message,
        });
    }
});
exports.startTimerController = startTimerController;
// Обновление таймера
const updateTimerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { task_id, elapsed_time, is_running } = req.body;
    if (!task_id || elapsed_time === undefined || is_running === undefined) {
        return res.status(400).send("Invalid data: Missing required fields");
    }
    try {
        const endTime = is_running ? null : new Date().toISOString();
        const roundedElapsedTime = Math.round(elapsed_time);
        yield db_connection_1.default.query(`UPDATE task_times SET duration = $1, end_time = $2 WHERE task_id = $3 AND end_time IS NULL`, [roundedElapsedTime, endTime, task_id]);
        res.status(200).json({ message: "Timer updated successfully" });
    }
    catch (error) {
        console.error("Error updating timer:", error.message);
        res.status(500).send(`Error updating timer: ${error.message}`);
    }
});
exports.updateTimerController = updateTimerController;
