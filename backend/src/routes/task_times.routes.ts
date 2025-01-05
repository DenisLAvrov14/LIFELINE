import { Router } from "express";
import {
  createTaskTimeController,
  updateTaskTimeController,
  updateTimerStatusController,
  markTaskAsDone,
  getTimerStatus,
  startTimerController,
} from "../controllers/task_times.controller";

const router = Router();

// Создание записи времени
router.post("/", createTaskTimeController);

// Обновление времени выполнения задачи
router.post("/update-task-time", updateTaskTimeController);

// Обновление статуса таймера (пауза/возобновление)
router.post("/update-timer", updateTimerStatusController);

// Получение статуса таймера
router.get("/status/:taskId", getTimerStatus);

// Запуск таймера
router.post("/start", startTimerController);

// Завершение задачи
router.put("/tasks/:id/done", markTaskAsDone);

// Продолжить работу таймера
router.post("/resume", (req, res) => {
  console.log("Request body:", req.body);
  res.status(200).send({ success: true, message: "Resume route works!" });
});

export default router;
