"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_times_controller_1 = require("../controllers/task_times.controller");
const router = (0, express_1.Router)();
// Запуск таймера
router.post("/start", task_times_controller_1.startTimerController);
// Пауза/возобновление таймера
router.post("/pause", task_times_controller_1.updateTimerStatusController);
// Получение статуса таймера
router.get("/status/:taskId", task_times_controller_1.getTimerStatus);
// Остановка таймера
router.post("/stop", task_times_controller_1.stopTimerController);
exports.default = router;
