import { Router } from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  markTaskAsDone,
} from "../controllers/tasks.controller";

const router = Router();

router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.put("/:id/done", markTaskAsDone);

export default router;
