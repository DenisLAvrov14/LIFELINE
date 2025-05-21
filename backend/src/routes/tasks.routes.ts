import { Router } from "express";
import {
  createTask,
  updateTask,
  deleteTask,
  markTaskAsDone,
} from "../controllers/tasks.controller";
import { authenticateToken } from "../middleware/authenticateToken";
import { ensureUserExists } from "../middleware/ensureUserExists";

const router = Router();

router.use(authenticateToken, ensureUserExists);

router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.put("/:id/done", markTaskAsDone);

export default router;
