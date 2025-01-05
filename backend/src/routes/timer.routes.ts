import { Router } from "express";
import {
  startTimerController,
  updateTimerStatusController,
  getTimerStatus,
  stopTimerController,
} from "../controllers/task_times.controller";

const router = Router();

// Запуск таймера
router.post("/start", startTimerController);

// Пауза/возобновление таймера
router.post("/pause", updateTimerStatusController);

// Получение статуса таймера
router.get("/status/:taskId", getTimerStatus);

// Остановка таймера
router.post("/stop", stopTimerController);

export default router;
