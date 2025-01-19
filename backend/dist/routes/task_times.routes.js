"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_times_controller_1 = require("../controllers/task_times.controller");
const router = (0, express_1.Router)();
// Создание записи времени
router.post("/", task_times_controller_1.createTaskTimeController);
// Обновление времени выполнения задачи
router.post("/update-task-time", task_times_controller_1.updateTaskTimeController);
// Обновление статуса таймера (пауза/возобновление)
router.post("/update-timer", task_times_controller_1.updateTimerStatusController);
// Получение статуса таймера
router.get("/status/:taskId", task_times_controller_1.getTimerStatus);
// Запуск таймера
router.post("/start", task_times_controller_1.startTimerController);
// Завершение задачи
router.put("/tasks/:id/done", task_times_controller_1.markTaskAsDone);
// Продолжить работу таймера
router.post("/resume", (req, res) => {
    console.log("Request body:", req.body);
    res.status(200).send({ success: true, message: "Resume route works!" });
});
exports.default = router;
