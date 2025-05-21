import { Router } from "express";
import {
  getTodos,
  updateTodo,
  deleteTodo,
} from "../controllers/todos.controller";
import { authenticateToken } from "../middleware/authenticateToken";
import { ensureUserExists } from "../middleware/ensureUserExists";

const router = Router();

router.get("/", authenticateToken, ensureUserExists, getTodos);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

export default router;
