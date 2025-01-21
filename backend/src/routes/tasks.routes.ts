import { Router } from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  markTaskAsDone,
} from "../controllers/tasks.controller";
import { authenticateToken } from "../middleware/authenticateToken";

const router = Router();

router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.put("/:id/done", authenticateToken, markTaskAsDone);

export default router;
