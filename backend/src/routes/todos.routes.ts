import { Router } from "express";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todos.controller";
import { authenticateToken } from "../middleware/authenticateToken";
import { ensureUserExists } from "../middleware/ensureUserExists";

const router = Router();

router.get("/", authenticateToken, ensureUserExists, getTodos);
router.post("/", createTodo);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

export default router;
