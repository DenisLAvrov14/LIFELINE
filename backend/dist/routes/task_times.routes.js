"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_times_controller_1 = require("../controllers/task_times.controller");
const router = (0, express_1.Router)();
// Существующие маршруты
router.post("/", task_times_controller_1.createTaskTimeController);
router.put("/task_times", task_times_controller_1.updateTaskTimeController);
router.put("/tasks/:id/done", task_times_controller_1.markTaskAsDone);
router.get("/status/:taskId", task_times_controller_1.getTimerStatus);
router.post("/start", task_times_controller_1.startTimerController); // Для старта таймера
router.post("/update", task_times_controller_1.updateTimerController); // Для обновления таймера
exports.default = router;
