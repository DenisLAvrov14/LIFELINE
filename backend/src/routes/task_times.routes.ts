import { Router } from "express";
import {
  createTaskTimeController,
  updateTaskTimeController,
  markTaskAsDone,
  getTimerStatus,
  startTimerController,
  updateTimerController, 
} from "../controllers/task_times.controller";

const router = Router();

// Существующие маршруты
router.post("/", createTaskTimeController);
router.put("/task_times", updateTaskTimeController);
router.put("/tasks/:id/done", markTaskAsDone);
router.get("/status/:taskId", getTimerStatus);
router.post("/start", startTimerController); // Для старта таймера
router.post("/update", updateTimerController); // Для обновления таймера

export default router;
